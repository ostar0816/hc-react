import React from 'react';
import gql from 'graphql-tag';

import css from './PAssignStudyContent.lessx';

import { Popover, Icon, Button, Row, Col, message, Progress, Radio } from 'antd';

import AssignStudyTable from './AssignStudyTable';
import { PAssignStudyContent_study, StudyStatusEnum, AssignPriorityEnum } from '../../gqlTypes';
import TableCustom from '../TableCustom/TableCustom';

type PAssignStudyContentProps = {
  selectedStudyIds: string[];
  studies: PAssignStudyContent_study[];
  onAssignStudiesToRadiologist(radiologistId: string, studyIds: string[]): void;
  onClose(): void;
};

class PAssignStudyContent extends React.Component<PAssignStudyContentProps> {
  handleUserRowClick = (tableType: string, userId: string) => {
    console.log('click', tableType, userId);
    const { selectedStudyIds } = this.props;

    this.props.onAssignStudiesToRadiologist(userId, selectedStudyIds);

    this.props.onClose();
  };

  render() {
    const { children, selectedStudyIds, studies } = this.props;
    if (!studies) {
      return null;
    }
    const selectedStudies = studies.filter(s => selectedStudyIds.includes(s._id));

    interface IStudyAssignPriority {
      study: typeof selectedStudies[0];
      assignPriority: AssignPriorityEnum;
    }
    interface IRadiologistOption {
      _id: string;
      name: string;
      online: boolean;
      workload: number;
      studiesAssignPriorities: IStudyAssignPriority[];
    }
    interface IRadMap {
      [key: string]: IRadiologistOption;
    }

    const radsMap: IRadMap = {};

    interface IAllowedRadsCount {
      [key: string]: number;
    }
    const allowedRadsCount: IAllowedRadsCount = {};
    const alreadyAssignedStudies: PAssignStudyContent_study[] = [];
    selectedStudies.forEach(study => {
      if (study.assignedTo) {
        alreadyAssignedStudies.push(study);
      }

      study.canBeAssignedTo.forEach(assignedTo => {
        const radiologist = assignedTo.radiologist;
        if (!allowedRadsCount[radiologist._id]) {
          allowedRadsCount[radiologist._id] = 0;
        }
        allowedRadsCount[radiologist._id]++;
        if (!radsMap[radiologist._id]) {
          const workload = Math.min(
            (radiologist.pendingStudies.length / radiologist.radiologyCapacity) * 100,
            100,
          );
          radsMap[assignedTo.radiologist._id] = {
            _id: radiologist._id,
            name: `${radiologist.lastName} ${radiologist.firstName}`,
            online: radiologist.online,
            workload: workload,
            studiesAssignPriorities: [
              {
                study,
                assignPriority: assignedTo.assignPriority,
              },
            ],
          };
        } else {
          radsMap[assignedTo.radiologist._id].studiesAssignPriorities.push({
            study,
            assignPriority: assignedTo.assignPriority,
          });
        }
      });
    });

    const allAssignOptions = Object.values(radsMap);
    const allowedAssignOptions = allAssignOptions.filter(
      o => allowedRadsCount[o._id] === selectedStudies.length,
    );

    const onlineRads = allowedAssignOptions.filter(o => o.online);
    const offlineRads = allowedAssignOptions.filter(o => !o.online);

    const columns = [
      {
        title: 'Already assigned studies:',
        children: [
          {
            dataIndex: 'patientName',
          },
          {
            dataIndex: 'studyDescription',
          },
          {
            dataIndex: 'assignedTo',
          },
        ],
      },
    ];

    return (
      <div className={css.popover}>
        {!alreadyAssignedStudies.length ? null : (
          <TableCustom
            className={css.assignedStudies}
            columns={columns}
            dataSource={alreadyAssignedStudies.map(study => ({
              key: study._id,
              patientName: study.patientName,
              studyDescription: study.studyDescriptionString,
              assignedTo: `${study.assignedTo.firstName} ${study.assignedTo.lastName}`,
            }))}
            pagination={false}
          />
        )}
        <Row gutter={6}>
          <Col span={12}>
            <AssignStudyTable
              tableTitle="Online Users"
              tableKey="online"
              dataSource={onlineRads}
              onTableRowClick={this.handleUserRowClick}
            />
          </Col>
          <Col span={12}>
            <AssignStudyTable
              tableTitle="Offline Users"
              tableKey="offline"
              dataSource={offlineRads}
              onTableRowClick={this.handleUserRowClick}
            />
          </Col>
        </Row>
      </div>
    );
  }

  static fragments = {
    study: gql`
      fragment PAssignStudyContent_study on Study {
        _id
        patientName
        studyDescriptionString
        assignedTo {
          _id
          firstName
          lastName
        }
        canBeAssignedTo {
          radiologist {
            _id
            firstName
            lastName
            online
            radiologyCapacity
            pendingStudies {
              _id
            }
          }
          assignPriority
        }
        studyStatus
      }
    `,
  };
}

export default PAssignStudyContent;
