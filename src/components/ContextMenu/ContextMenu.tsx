import { ContextualMenu, IContextualMenuItem } from '@fluentui/react';
import { useRef } from 'react';
import useStore from '../../store';

export enum ContextMenuTypes {
  DEFAULT,
  NODE,
  EDGE,
}

export type ContextMenuProps = {
  pos: {
    x: number;
    y: number;
  };
  show: boolean;
  elementId?: string;
  type: ContextMenuTypes;
  relativePos?: {
    x: number;
    y: number;
  };
  onDismiss?: () => void;
};

const ContextMenu = ({
  pos,
  show,
  type,
  elementId,
  relativePos,
  onDismiss,
}: ContextMenuProps) => {
  const linkRef = useRef(null);

  //menu items: left if needed in future
  /*
  const menuItems: IContextualMenuItem[] = Object.keys(
    polyglotNodeComponentMapping.nameMapping
  ).map((index, id) => {
    return {
      key: id.toString(),
      text: 'New ' + polyglotNodeComponentMapping.nameMapping[index],
      iconProps: { iconName: 'Add' },
      onClick: () => {
        const nodeToAdd = createNewDefaultPolyglotNode(
          relativePos || pos,
          index
        );
        useStore.getState().addNode(nodeToAdd);
      },
    };
  });
  */

  const menuNodeActions: IContextualMenuItem[] = [
    {
      key: '0',
      text: 'Remove',
      iconProps: { iconName: 'Delete' },
      onClick: () => {
        if (!elementId) return;
        useStore.getState().removeNode(elementId);
      },
    },
  ];

  const menuEdgeActions: IContextualMenuItem[] = [
    {
      key: '0',
      text: 'Remove',
      iconProps: { iconName: 'Delete' },
      onClick: () => {
        if (!elementId) return;
        useStore.getState().removeEdge(elementId);
      },
    },
  ];

  if (type === ContextMenuTypes.DEFAULT) {
    console.log('Target undefined!');
    return <span></span>;
  }

  return (
    <>
      <span
        className="absolute z-50"
        ref={linkRef}
        style={{ top: pos.y, left: pos.x }}
      />
      <ContextualMenu
        className="pt-2"
        hidden={!show}
        items={
          type === ContextMenuTypes.NODE ? menuNodeActions : menuEdgeActions
        }
        styles={{ root: { top: pos.y, left: pos.x } }}
        target={linkRef}
        onDismiss={onDismiss}
      />
    </>
  );
};

export default ContextMenu;
