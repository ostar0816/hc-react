import React from 'react';

import { Button, Select } from 'antd';
const Option = Select.Option;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  Editor,
  EditorState,
  ContentBlock,
  CompositeDecorator,
  RichUtils,
  Modifier,
} from 'draft-js';

import css from './RichEditor.lessx';

import StudyTableColumns from '../../../server/constants/studyTableColumns';

type EditorVariables = {
  label: string;
  style: string;
  icon?: IconProp;
};
type RichEditorProps = {
  disabled?: boolean;
  isInsertTemplateConstantHidden?: boolean;
  editorState: EditorState;
  onChange?(editorRawContent: EditorState): void;
};

class RichEditor extends React.Component<RichEditorProps> {
  blockStyler: any;
  onChange(editorState: EditorState): void;

  TEXT_SIZES: EditorVariables[] = [
    { label: 'Body', style: 'body' },
    { label: 'Header', style: 'header-one' },
  ];
  // const BLOCK_TYPES = [
  //   { label: 'Align Left', style: 'alignleft', icon: 'align-left' },
  //   { label: 'Align Center', style: 'aligncenter', icon: 'align-center' },
  //   { label: 'Align Right', style: 'alignright', icon: 'align-right' },
  // ];
  INLINE_STYLES: EditorVariables[] = [
    { label: 'Bold', style: 'BOLD', icon: 'bold' },
    { label: 'Italic', style: 'ITALIC', icon: 'italic' },
    { label: 'Underline', style: 'UNDERLINE', icon: 'underline' },
  ];

  constructor(props: RichEditorProps) {
    super(props);

    this.onChange = (editorState: EditorState) => {
      if (props.onChange && !props.disabled) {
        props.onChange(editorState);
      }
    };
  }

  componentDidMount() {
    const { editorState } = this.props;

    this.onChange(this.searchHighlight(editorState));
  }

  handleOnInlineStyleClick(styleType: string) {
    this.onChange(RichUtils.toggleInlineStyle(this.props.editorState, styleType));
  }
  handleOnBlockTypeClick(blockType: string) {
    this.onChange(RichUtils.toggleBlockType(this.props.editorState, blockType));
  }
  handleTextStyleChange = (value: string) => {
    this.handleOnBlockTypeClick(value);
  };
  handleKeyCommand(command: string, editorState: EditorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }
  handleInsertConstant = (value: string) => {
    const { editorState } = this.props;

    let newEditorState = EditorState.push(
      editorState,
      Modifier.insertText(editorState.getCurrentContent(), editorState.getSelection(), value),
      'insert-characters',
    );

    newEditorState = this.searchHighlight(newEditorState);

    this.onChange(newEditorState);
  };

  searchHighlight = (editorState: EditorState) => {
    let regex = '';
    Object.keys(StudyTableColumns).forEach(columnKey => {
      regex += `${regex.length > 0 ? '|' : ''}(@${columnKey}@)`;
    });

    return EditorState.set(editorState, {
      decorator: this.generateDecorator(regex),
    });
  };
  // https://reactrocket.com/post/draft-js-search-and-replace/
  generateDecorator = (highlightTerm: string) => {
    const regex = new RegExp(highlightTerm, 'g');
    return new CompositeDecorator([
      {
        strategy: (contentBlock, callback) => {
          if (highlightTerm !== '') {
            this.findWithRegex(regex, contentBlock, callback);
          }
        },
        component: this.selectHighlight,
      },
    ]);
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
  selectHighlight = (props: any) => <span className={css.highlightText}>{props.children}</span>;

  // https://gist.github.com/deanmcpherson/69f9962b744b273ffb64fe294ab71bc4
  /*getBlockAlignment = block => {
    let style = 'left';

    block.findStyleRanges(function(e) {
      if (e.hasStyle('center')) style = 'center';
      if (e.hasStyle('right')) style = 'right';
    });

    return style;
  };
  // In the blockStyleFn
  blockStyler = block => {
    let alignment = this.getBlockAlignment(block);

    if (!block.getText()) {
      let previousBlock = this.state.editorState.getCurrentContent().getBlockBefore(block.getKey());
      if (previousBlock) {
        alignment = this.getBlockAlignment(previousBlock);
      }
    }

    return `alignment--${alignment}`;
  };
  styleWholeSelectedBlocksModifier = (editorState, style, removeStyles = []) => {
    let currentContent = editorState.getCurrentContent();
    let selection = editorState.getSelection();
    let focusBlock = currentContent.getBlockForKey(selection.getFocusKey());
    let anchorBlock = currentContent.getBlockForKey(selection.getAnchorKey());
    let selectionIsBackward = selection.getIsBackward();

    let changes = {
      anchorOffset: 0,
      focusOffset: focusBlock.getLength(),
    };

    if (selectionIsBackward) {
      changes = {
        focusOffset: 0,
        anchorOffset: anchorBlock.getLength(),
      };
    }
    let selectWholeBlocks = selection.merge(changes);
    let modifiedContent = Modifier.applyInlineStyle(currentContent, selectWholeBlocks, style);
    let finalContent = removeStyles.reduce(function(content, style) {
      return Modifier.removeInlineStyle(content, selectWholeBlocks, style);
    }, modifiedContent);
    return EditorState.push(editorState, finalContent, 'change-inline-style');
  };*/

  render() {
    const { editorState, isInsertTemplateConstantHidden, disabled } = this.props;

    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    const selectedTextSize = this.TEXT_SIZES.find(size => size.style === blockType);
    // const selectedBlocType = BLOCK_TYPES.find(type => type.style === blockType);
    // if (selectedBlocType && selectedBlocType.style) {
    //   this.styleWholeSelectedBlocksModifier(editorState, selectedBlocType.style);
    // }

    return (
      <div className={css.editor}>
        <div className={css.header}>
          <div>
            <Button
              size="small"
              shape="circle"
              disabled={disabled || !editorState.getUndoStack().size}
              onClick={() => {
                this.onChange(EditorState.undo(editorState));
              }}
            >
              <FontAwesomeIcon icon="undo" />
            </Button>
            <Button
              size="small"
              shape="circle"
              disabled={disabled || !editorState.getRedoStack().size}
              onClick={() => {
                this.onChange(EditorState.redo(editorState));
              }}
            >
              <FontAwesomeIcon icon="redo" />
            </Button>

            <Select
              size="small"
              disabled={disabled}
              value={
                selectedTextSize && selectedTextSize.style
                  ? selectedTextSize.style
                  : this.TEXT_SIZES[0].style
              }
              style={{ width: 120 }}
              onChange={this.handleTextStyleChange}
            >
              {this.TEXT_SIZES.map(textSize => (
                <Option key={textSize.style} value={textSize.style}>
                  {textSize.label}
                </Option>
              ))}
            </Select>

            {this.INLINE_STYLES.map(inlineStyle => (
              <Button
                key={inlineStyle.style}
                size="small"
                disabled={disabled}
                type={editorState.getCurrentInlineStyle().has(inlineStyle.style) ? 'primary' : null}
                shape="circle"
                onClick={() => this.handleOnInlineStyleClick(inlineStyle.style)}
              >
                <FontAwesomeIcon icon={inlineStyle.icon} />
              </Button>
            ))}
            {/*BLOCK_TYPES.map(blockStyle => (
            <Button
              key={blockStyle.style}
              size="small"
              type={blockType === blockStyle.style ? 'primary' : null}
              shape="circle"
              onClick={() => this.handleOnBlockTypeClick(blockStyle.style)}
            >
              <FontAwesomeIcon icon={blockStyle.icon} />
            </Button>
          ))*/}
          </div>

          <div>
            {isInsertTemplateConstantHidden ? null : (
              <Select
                size="small"
                placeholder="Insert constant"
                disabled={disabled}
                value={undefined}
                style={{ width: 160 }}
                onChange={(value: string) => {
                  this.handleInsertConstant(value);
                  return false;
                }}
              >
                {Object.keys(StudyTableColumns).map((columnKey: keyof typeof StudyTableColumns) => (
                  <Option key={columnKey} value={`@${columnKey}@`}>
                    {StudyTableColumns[columnKey].label}
                  </Option>
                ))}
              </Select>
            )}
          </div>
        </div>

        <div className={css.body}>
          <div className={css.body__editor}>
            <Editor
              blockStyleFn={this.blockStyler}
              editorState={editorState}
              onChange={this.onChange}
              handleKeyCommand={this.handleKeyCommand}
            />
          </div>
        </div>

        <div />
      </div>
    );
  }
}

export default RichEditor;
