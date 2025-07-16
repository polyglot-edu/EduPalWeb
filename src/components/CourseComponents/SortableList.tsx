import { Box, Flex, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

// Base type that all sortable items must extend
export type SortableBaseItem = {
  _id: string;
  label?: string;
  render?: () => React.ReactNode;
};

// Props for the full SortableList component
type SortableListProps<T extends SortableBaseItem> = {
  items: T[];
  onChange: (updated: T[]) => void;
  onAdd?: () => void;
  renderActions?: (item: T) => React.ReactNode;
  renderItem?: (item: T) => React.ReactNode;
};

// Item component inside the list
function SortableListItem<T extends SortableBaseItem>({
  item,
  renderActions,
  renderItem,
}: {
  item: T;
  renderActions?: (item: T) => React.ReactNode;
  renderItem?: (item: T) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const bg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Flex
      ref={setNodeRef}
      style={style}
      align="center"
      justify="space-between"
      p={3}
      borderWidth="1px"
      borderRadius="md"
      bg={bg}
      borderColor={borderColor}
      {...attributes}
      {...listeners}
    >
      <Box flex="1">
        {' '}
        {renderItem ? (
          renderItem(item)
        ) : item.render ? (
          item.render()
        ) : (
          <Text>{item.label}</Text>
        )}
      </Box>
      {renderActions && <Box ml={3}>{renderActions(item)}</Box>}
    </Flex>
  );
}

// Main component: sortable list
function SortableList<T extends SortableBaseItem>({
  items,
  onChange,
  onAdd,
  renderActions,
  renderItem,
}: SortableListProps<T>) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item._id === active.id);
    const newIndex = items.findIndex((item) => item._id === over.id);

    const reordered = arrayMove(items, oldIndex, newIndex);
    onChange(reordered);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i._id)}
          strategy={verticalListSortingStrategy}
        >
          <Stack spacing={3}>
            {items.map((item) => (
              <SortableListItem<T>
                key={item._id}
                item={item}
                renderActions={renderActions}
                renderItem={renderItem}
              />
            ))}
          </Stack>
        </SortableContext>
      </DndContext>
    </>
  );
}

export default SortableList;
