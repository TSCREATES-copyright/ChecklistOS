import React from 'react';
import { Checklist, ChecklistStep } from '../../types/checklist';
import { ChecklistItem } from './ChecklistItem';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

export function ChecklistCanvas({ checklist, onToggleStep, onReorderSteps }: { checklist: Checklist, onToggleStep: (id: string) => void, onReorderSteps?: (steps: ChecklistStep[]) => void }) {
  // Group by parentId
  const rootSteps = checklist.steps.filter(s => !s.parentId);
  const getSubsteps = (parentId: string) => checklist.steps.filter(s => s.parentId === parentId);

  const handleDragEnd = (result: DropResult) => {
    if (!onReorderSteps) return;
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex === destinationIndex && result.source.droppableId === result.destination.droppableId) return;

    const newSteps = [...checklist.steps];
    
    if (result.type === 'ROOT') {
      // Reordering root steps
      const currentRootSteps = newSteps.filter(s => !s.parentId);
      const [moved] = currentRootSteps.splice(sourceIndex, 1);
      currentRootSteps.splice(destinationIndex, 0, moved);
      
      // Reconstruct full list maintaining substeps order
      const finalSteps: ChecklistStep[] = [];
      currentRootSteps.forEach(root => {
        finalSteps.push(root);
        finalSteps.push(...newSteps.filter(s => s.parentId === root.id));
      });
      onReorderSteps(finalSteps);
    } else if (result.type === 'SUBSTEP') {
      // Reordering substeps (possibly across parents)
      const sourceParentId = result.source.droppableId;
      const destinationParentId = result.destination.droppableId;
      
      const sourceSubsteps = newSteps.filter(s => s.parentId === sourceParentId);
      const [movedOriginal] = sourceSubsteps.splice(sourceIndex, 1);
      
      // Update parentId if moved to a different parent
      const moved = { ...movedOriginal, parentId: destinationParentId };
      
      let destinationSubsteps = sourceSubsteps;
      if (sourceParentId !== destinationParentId) {
        destinationSubsteps = newSteps.filter(s => s.parentId === destinationParentId);
      }
      
      destinationSubsteps.splice(destinationIndex, 0, moved);
      
      // Reconstruct full list
      const finalSteps: ChecklistStep[] = [];
      const currentRootSteps = newSteps.filter(s => !s.parentId);
      currentRootSteps.forEach(root => {
        finalSteps.push(root);
        if (root.id === sourceParentId && sourceParentId === destinationParentId) {
          finalSteps.push(...sourceSubsteps);
        } else if (root.id === sourceParentId) {
          finalSteps.push(...sourceSubsteps);
        } else if (root.id === destinationParentId) {
          finalSteps.push(...destinationSubsteps);
        } else {
          finalSteps.push(...newSteps.filter(s => s.parentId === root.id && s.id !== moved.id));
        }
      });
      onReorderSteps(finalSteps);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="root" type="ROOT">
        {(provided) => (
          <div 
            {...provided.droppableProps} 
            ref={provided.innerRef}
            className="max-w-3xl mx-auto space-y-4 pb-12"
          >
            {rootSteps.map((step, index) => (
              // @ts-expect-error React 19 typing issue with Draggable key
              <Draggable key={step.id} draggableId={step.id} index={index}>
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 ${snapshot.isDragging ? 'shadow-lg ring-2 ring-[#0047AB]/20 z-50' : 'hover:shadow-md'}`}
                  >
                    <ChecklistItem 
                      step={step} 
                      onToggle={onToggleStep} 
                      dragHandleProps={provided.dragHandleProps}
                    />
                    {getSubsteps(step.id).length > 0 && (
                      <Droppable droppableId={step.id} type="SUBSTEP">
                        {(providedSub) => (
                          <div 
                            ref={providedSub.innerRef}
                            {...providedSub.droppableProps}
                            className="bg-slate-50/50 border-t border-slate-100 p-2 pl-4 sm:pl-8 space-y-1 relative"
                          >
                            <div className="absolute left-6 sm:left-10 top-0 bottom-4 w-px bg-slate-200"></div>
                            {getSubsteps(step.id).map((substep, subIndex) => (
                              // @ts-expect-error React 19 typing issue with Draggable key
                              <Draggable key={substep.id} draggableId={substep.id} index={subIndex}>
                                {(providedSubDrag, snapshotSub) => (
                                  <div 
                                    ref={providedSubDrag.innerRef}
                                    {...providedSubDrag.draggableProps}
                                    className={`relative z-10 ${snapshotSub.isDragging ? 'z-50' : ''}`}
                                  >
                                    <div className="absolute left-[-17px] sm:left-[-17px] top-6 w-4 h-px bg-slate-200"></div>
                                    <ChecklistItem 
                                      step={substep} 
                                      onToggle={onToggleStep} 
                                      isSubstep 
                                      dragHandleProps={providedSubDrag.dragHandleProps}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {providedSub.placeholder}
                          </div>
                        )}
                      </Droppable>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
