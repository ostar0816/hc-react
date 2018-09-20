import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import graphqlClient from '../../graphqlClient';

import classSet from 'classnames';
import moment from 'moment';

import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  Modifier,
  SelectionState,
  ContentBlock,
} from 'draft-js';
import { Col, Row, Select, Tabs, Button, message, Modal } from 'antd';
const Option = Select.Option;
const TabPane = Tabs.TabPane;

import css from './DBStudyReport.lessx';

import ActionButtons from './ActionButtons';
import CreateStudyRequestForm from './CreateStudyRequestForm';
import StudyReportNotes from './StudyReportNotes';
import StudyReportFooter from './StudyReportFooter';

import TableCustom from '../TableCustom/TableCustom';
import DashboardWindow from '../DashboardWindow/DashboardWindow';
import RichEditor from '../RichEditor/RichEditor';

import {
  DBStudyReport_root,
  DBStudyReport_rootVariables,
  PermissionEnum,
  StudyStatusEnum,
  DBStudyReport_root_viewer_searchStudy,
} from '../../gqlTypes';

import { IFlowUpdateState } from '../FlowBoard/FlowBoard';

import StudyTableColumns, { TStudyTableColumn } from '../../../server/constants/studyTableColumns';

const dbStudyReport_rootQuery = gql`
  query DBStudyReport_root($studyId: ObjectId) {
    viewer {
      _id
      user {
        _id
        userRole {
          permissions
        }
        pendingStudies {
          _id
        }
        ...StudyReportNotes_user
      }
      searchStudy: searchStudyById(studyId: $studyId) {
        _id
        patientName
        patientSex
        patientId
        patientDOB
        accessionNumber
        history
        facilityName
        readType
        arriveTimeStart
        contrastType
        studyDescription {
          _id
          name
          modality
          reportTemplate {
            _id
            template
          }
        }
        studyStatus
        report {
          content
          signedOffDate
        }
        addendums {
          content
        }
        priorStudies {
          _id
          arriveTimeStart
          studyDescription {
            modality
            name
          }
        }
        notes {
          ...StudyReportNotes_studyNotes
        }
      }
    }
  }
  ${StudyReportNotes.fragments.studyNotes}
  ${StudyReportNotes.fragments.currentUser}
`;

const addStudyNoteMutation = gql`
  mutation addStudyNote($studyId: ObjectId!, $title: String!, $text: String!, $type: NoteTypeEnum) {
    addStudyNote(studyId: $studyId, title: $title, text: $text, type: $type) {
      _id
      notes {
        ...StudyReportNotes_studyNotes
      }
      supportRequestStatus
    }
  }
  ${StudyReportNotes.fragments.studyNotes}
`;
const signOffReportMutation = gql`
  mutation signOffReport($studyId: ObjectId!, $content: JSON!) {
    signOffReport(studyId: $studyId, content: $content) {
      _id
      studyStatus
      report {
        content
        signedOffDate
      }
    }
  }
`;
const signOffAddendumMutation = gql`
  mutation signOffAddendum($studyId: ObjectId!, $content: JSON!) {
    signOffAddendum(studyId: $studyId, content: $content) {
      _id
      studyStatus
      addendums {
        content
      }
    }
  }
`;

type TServerState = {
  selectedStudyId: string;
};
type TClientState = {
  editorState: any;
};
type DBStudyReportWindowState = {
  selectedStudyId: string;
  editorState: any;
};

type DBStudyReportProps = {
  serverState: TServerState;
  clientState: TClientState;
  splitDirection: string;
  onServerStateUpdate: IFlowUpdateState<TServerState>;
  onClientStateUpdate: IFlowUpdateState<TClientState>;
  onSplitVertical(): void;
  onSplitHorizontal(): void;
  onSwapWindows(): void;
  onMaximize(): void;
  onClose(): void;
  onWindowStateUpdate(state: DBStudyReportWindowState): void;
  onOpenStudyReportWindow(studyId: string): void;
} & DBStudyReport_root;
const initialState = {
  visibleCreateStudyRequestModal: '',
  visibleCreateUrgencyRequestModal: '',
  createNewAddendum: false,
  selectedTabPane: 'REPORT',
};
type DBStudyReportState = Readonly<typeof initialState>;

export class DBStudyReport extends React.Component<
  DBStudyReportProps & DBStudyReport_root,
  DBStudyReportState
> {
  formCreateStudyRequestRef: any;

  state = initialState;

  STYLE = {
    reportColumnHeight: 291,
    reportColumnWithoutHeaderHeight: 270,
  };

  componentDidMount() {
    const study = this.props.viewer.searchStudy;
    const { clientState } = this.props;
    if (!clientState) {
      if (study.studyDescription && study.studyDescription.reportTemplate) {
        const contentState = convertFromRaw(study.studyDescription.reportTemplate.template as any);
        const editorState = EditorState.createWithContent(contentState);

        const newEditorState = this.findReplaceInTemplate(editorState);

        this.props.onClientStateUpdate({ editorState: newEditorState });
      } else {
        this.props.onClientStateUpdate({ editorState: EditorState.createEmpty() });
      }
    }

    // To disabled submit button at the beginning.
    // this.props.form.validateFields();
  }

  handleStudyRequestCreate = () => {
    const form = this.formCreateStudyRequestRef.props.form;
    form.validateFields((err: any, values: any) => {
      if (err) {
        return;
      }

      const { viewer } = this.props;
      const { visibleCreateStudyRequestModal } = this.state;
      const study = viewer.searchStudy;

      graphqlClient.mutate({
        mutation: addStudyNoteMutation,
        variables: {
          studyId: study._id,
          text: values.text,
          title: values.title,
          type: visibleCreateStudyRequestModal
            ? 'SUPPORT_STUDY_REQUEST'
            : 'SUPPORT_URGENCY_REQUEST',
        },
      });

      this.setState({
        visibleCreateStudyRequestModal: '',
        visibleCreateUrgencyRequestModal: '',
      });
    });
  };
  handleEditorChange = (editorState: EditorState) => {
    this.props.onClientStateUpdate({ editorState });
  };
  handleSignOff = (openNext = false, isAddendum = false) => {
    const currentContent = this.props.clientState.editorState.getCurrentContent();
    const currentRawContent = convertToRaw(currentContent);

    const { serverState } = this.props;

    graphqlClient
      .mutate({
        mutation: isAddendum ? signOffAddendumMutation : signOffReportMutation,
        variables: {
          studyId: serverState.selectedStudyId,
          content: currentRawContent,
        },
      })
      .then(() => {
        message.success('Study Report Saved');

        const { user, searchStudy } = this.props.viewer;
        const { pendingStudies } = user;
        const nextStudy = pendingStudies.find(s => s._id !== searchStudy._id);
        if (nextStudy) {
          setTimeout(() => {
            this.props.onOpenStudyReportWindow(nextStudy._id);
          });
        }

        if (isAddendum) {
          this.setState({ createNewAddendum: false, selectedTabPane: 'REPORT' });
        }

        this.props.onClose();
      });
  };

  replaceTemplateKeyWithText = (columnKey: string, column: TStudyTableColumn) => {
    const { viewer } = this.props;
    let text: string = (viewer.searchStudy as any)[columnKey];
    if (!text) {
      return '';
    }

    if (column.type === 'Date' || column.type === 'DateTime') {
      text = moment(text).format(`L${column.type === 'DateTime' ? ', h:mm:ss a' : ''}`);
    }

    return text;
  };
  findWithRegex = (regex: RegExp, contentBlock: ContentBlock, callback: any) => {
    const text = contentBlock.getText();
    let matchArr, start, end;
    while ((matchArr = regex.exec(text)) !== null) {
      start = matchArr.index;
      end = start + matchArr[0].length;
      callback(start, end);
    }
  };
  findReplaceInTemplate = (editorState: EditorState) => {
    const { viewer } = this.props;

    if (!viewer.searchStudy) {
      return;
    }

    let newEditorState = editorState;

    Object.keys(StudyTableColumns).forEach(columnKey => {
      const column = StudyTableColumns[columnKey];
      const regex = new RegExp(`@${columnKey}@`, 'g');
      const selectionsToReplace: any[] = [];

      const blockMap = newEditorState.getCurrentContent().getBlockMap();

      blockMap.forEach(contentBlock =>
        this.findWithRegex(regex, contentBlock, (start: number, end: number) => {
          const blockKey = contentBlock.getKey();
          const blockSelection = SelectionState.createEmpty(blockKey).merge({
            anchorOffset: start,
            focusOffset: end,
          });

          selectionsToReplace.push({
            rangeToReplace: blockSelection,
            style: contentBlock
              .getCharacterList()
              .get(start)
              .getStyle(),
          });
        }),
      );

      let contentState = newEditorState.getCurrentContent();

      selectionsToReplace.forEach(selectionToReplace => {
        contentState = Modifier.replaceText(
          contentState,
          selectionToReplace.rangeToReplace,
          this.replaceTemplateKeyWithText(columnKey, column),
          selectionToReplace.style,
        );
      });

      if (selectionsToReplace.length > 0) {
        newEditorState = EditorState.push(newEditorState, contentState, 'insert-characters');
      }
    });

    return newEditorState;
  };

  renderUserTable() {
    const { viewer } = this.props;
    const study = viewer.searchStudy;

    const columns = [
      {
        dataIndex: 'firstColumn',
      },
    ];
    const dataSource = [
      {
        key: '1',
        firstColumn: study.accessionNumber,
      },
      {
        key: '2',
        firstColumn: moment(study.patientDOB).format('L'),
      },
      {
        key: '3',
        firstColumn: `${study.studyDescription.modality} ${study.studyDescription.name}`,
      },
      {
        key: '4',
        firstColumn: study.readType,
        secondColumn: '153/153',
      },
    ];

    if (study.contrastType) {
      dataSource.push({
        key: 'contrastType',
        firstColumn: study.contrastType,
      });
    }

    return (
      <div
        className={css.firstColumnContent}
        style={{ height: this.STYLE.reportColumnWithoutHeaderHeight }}
      >
        <div>
          <TableCustom
            bordered
            pagination={false}
            antdSize="small"
            columns={columns}
            dataSource={dataSource}
            showHeader={false}
            className={css.table}
            scroll={{ y: 150 }}
          />
        </div>
        <div>
          <div>History</div>
          <div className={css.firstColumnContent__history}>{study.history}</div>
        </div>
      </div>
    );
  }
  render() {
    const { children, viewer, clientState } = this.props;
    const {
      visibleCreateStudyRequestModal,
      visibleCreateUrgencyRequestModal,
      createNewAddendum,
      selectedTabPane,
    } = this.state;
    const study = viewer.searchStudy;
    const { user } = viewer;

    if (!clientState) {
      return null;
    }
    let { editorState } = clientState;

    const priorStudiesList = study.priorStudies.map(study => ({
      key: study._id,
      studyType: study.studyDescription.name,
      modality: study.studyDescription.modality,
      date: moment(study.arriveTimeStart).format('L'),
    }));

    const permissionToSignOff = user.userRole.permissions.includes(PermissionEnum.SIGN_OFF_STUDY);

    const columns = [
      {
        title: 'Study Type',
        dataIndex: 'studyType',
        // width: 150,
      },
      {
        title: 'Mod',
        dataIndex: 'modality',
        width: 45,
      },
      {
        title: 'Date',
        dataIndex: 'date',
        width: 75,
      },
      {
        title: '',
        width: 40,
        dataIndex: '__ACTION__',
        render: () => <ActionButtons studyId="id" onDownload={null} onViewStudy={null} />,
      },
    ];
    const selectUrgencyRequestOptions = [
      {
        key: '1',
        title: 'Significant finding, NE',
      },
      {
        key: '2',
        title: 'Call findings',
      },
      {
        key: '3',
        title: 'Critical call',
      },
      {
        key: '4',
        title: 'Critical addendum',
      },
    ];
    const selectStudyRequestOptions = [
      {
        key: 'MISSING_IMAGES',
        title: 'Missing Images',
      },
      {
        key: 'MISSING_PRIOR_IMAGES',
        title: 'Missing prior images',
      },
      {
        key: 'MISSING_PRIOR_REPORT',
        title: 'Missing prior report',
      },
      {
        key: 'MISSING_US_WORKSHEET',
        title: 'Missing US worksheet',
      },
      {
        key: 'CUSTOM_REQUEST',
        title: 'Custom request',
      },
    ];
    const noteModalTitle = visibleCreateStudyRequestModal
      ? selectStudyRequestOptions.find(sr => sr.key === visibleCreateStudyRequestModal).title
      : visibleCreateUrgencyRequestModal
        ? selectUrgencyRequestOptions.find(us => us.key === visibleCreateUrgencyRequestModal).title
        : '';
    const isSignedOffReport = study.studyStatus === StudyStatusEnum.SIGNED_OFF;
    let reportEditorState = editorState;
    if (isSignedOffReport && study.report && study.report.content) {
      const contentState = convertFromRaw(study.report.content);
      reportEditorState = EditorState.createWithContent(contentState);
    }

    return (
      <DashboardWindow
        title="Study Report"
        onMaximize={this.props.onMaximize}
        onClose={this.props.onClose}
        onSplitHorizontal={this.props.onSplitHorizontal}
        onSplitVertical={this.props.onSplitVertical}
        onSwapWindows={this.props.onSwapWindows}
        splitDirection={this.props.splitDirection}
      >
        <div className={css.report}>
          <div style={{ height: this.STYLE.reportColumnHeight }}>
            <Row gutter={1}>
              <Col span={7}>
                <div>
                  {study.patientName}, {study.patientSex}
                </div>
                {this.renderUserTable()}
              </Col>
              <Col span={9}>
                <TableCustom
                  bordered
                  pagination={false}
                  antdSize="small"
                  columns={columns}
                  dataSource={priorStudiesList}
                  className={css.table}
                  scroll={{ y: this.STYLE.reportColumnWithoutHeaderHeight }}
                  style={{ height: this.STYLE.reportColumnHeight }}
                />
              </Col>

              <Col span={8}>
                <StudyReportNotes
                  studyId={study._id}
                  user={viewer.user}
                  notes={study.notes}
                  style={{ height: this.STYLE.reportColumnHeight }}
                />
              </Col>
            </Row>
          </div>

          <div className={css.report__requests}>
            <div>
              <Select
                size="small"
                style={{ width: 250 }}
                placeholder="Urgency Request"
                value={visibleCreateUrgencyRequestModal || undefined}
                onChange={(value: string) =>
                  this.setState({ visibleCreateUrgencyRequestModal: value })
                }
              >
                {selectUrgencyRequestOptions.map(option => (
                  <Option key={option.key}>{option.title}</Option>
                ))}
              </Select>
            </div>

            <div>
              <Select
                size="small"
                placeholder="Study Request"
                value={visibleCreateStudyRequestModal || undefined}
                style={{ width: 200 }}
                onChange={(value: string) =>
                  this.setState({ visibleCreateStudyRequestModal: value })
                }
              >
                {selectStudyRequestOptions.map(option => (
                  <Option key={option.key}>{option.title}</Option>
                ))}
              </Select>
              <Modal
                visible={!!visibleCreateStudyRequestModal || !!visibleCreateUrgencyRequestModal}
                title={`Request Note: ${noteModalTitle}`}
                okText="Create"
                onCancel={() =>
                  this.setState({
                    visibleCreateStudyRequestModal: '',
                    visibleCreateUrgencyRequestModal: '',
                  })
                }
                onOk={this.handleStudyRequestCreate}
                destroyOnClose
              >
                <CreateStudyRequestForm
                  title={noteModalTitle}
                  wrappedComponentRef={(formRef: any) => {
                    this.formCreateStudyRequestRef = formRef;
                  }}
                />
              </Modal>
            </div>
          </div>

          <div>
            <Tabs
              defaultActiveKey="REPORT"
              activeKey={selectedTabPane}
              className={css.tabs}
              size="small"
              onChange={value => this.setState({ selectedTabPane: value })}
              tabBarExtraContent={
                isSignedOffReport && permissionToSignOff ? (
                  <Button
                    size="small"
                    icon="plus"
                    onClick={() =>
                      this.setState({ createNewAddendum: true, selectedTabPane: 'ADDENDUM_NEW' })
                    }
                  >
                    Add Addendum
                  </Button>
                ) : null
              }
            >
              <TabPane tab="Report" key="REPORT">
                <div className={css.editor}>
                  <div className={css.editor__content}>
                    <RichEditor
                      disabled={isSignedOffReport}
                      isInsertTemplateConstantHidden
                      editorState={isSignedOffReport ? reportEditorState : editorState}
                      onChange={this.handleEditorChange}
                    />
                  </div>

                  <div className={css.editor__footer}>
                    <StudyReportFooter
                      onClose={this.props.onClose}
                      onSave={this.handleSignOff}
                      disabled={!permissionToSignOff || isSignedOffReport}
                    />
                  </div>
                </div>
              </TabPane>

              {study.addendums.map((addendum, index) => {
                const contentState = convertFromRaw(addendum.content);
                const addendumEditorState = EditorState.createWithContent(contentState);

                return (
                  <TabPane tab={`Addendum ${index + 1}`} key={`ADDENDUM_${index}`}>
                    <div className={css.editor}>
                      <div className={css.editor__content}>
                        <RichEditor
                          isInsertTemplateConstantHidden
                          disabled={true}
                          editorState={addendumEditorState}
                        />
                      </div>

                      <div className={css.editor__footer}>
                        <StudyReportFooter
                          signButton="Sign Off Addendum"
                          onClose={this.props.onClose}
                          disabled={true}
                        />
                      </div>
                    </div>
                  </TabPane>
                );
              })}
              {createNewAddendum ? (
                <TabPane tab="New Addendum" key="ADDENDUM_NEW">
                  <div className={css.editor}>
                    <div className={css.editor__content}>
                      <RichEditor
                        isInsertTemplateConstantHidden
                        editorState={editorState}
                        onChange={this.handleEditorChange}
                      />
                    </div>

                    <div className={css.editor__footer}>
                      <StudyReportFooter
                        signButton="Sign Off Addendum"
                        onClose={this.props.onClose}
                        onSave={openNext => this.handleSignOff(openNext, true)}
                        disabled={!permissionToSignOff || undefined}
                      />
                    </div>
                  </div>
                </TabPane>
              ) : null}
            </Tabs>
          </div>
        </div>
      </DashboardWindow>
    );
  }
}

const DBStudyReportContainer = graphql<
  DBStudyReportProps,
  DBStudyReport_root,
  DBStudyReport_rootVariables
>(dbStudyReport_rootQuery, {
  options: props => ({
    variables: { studyId: props.serverState.selectedStudyId },
    pollInterval: 3000,
  }),
});

export default DBStudyReportContainer(({ data, ...props }) => {
  const { loading, viewer } = data;

  if (loading || !viewer || !viewer.searchStudy) {
    return null;
  }

  const { serverState } = props;
  return <DBStudyReport key={serverState.selectedStudyId} viewer={viewer} {...props} />;
});
