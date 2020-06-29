import React, { useRef, useContext } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import BoardContext from '../Board/context';
import { Container, Label } from './styles';

export default function Card({ data, index, listIndex }) {
  const ref = useRef();
  const { move } = useContext(BoardContext);

  // Drag
  const [{ isDragging }, dragRef] = useDrag({
    item: { type: 'CARD', index, listIndex },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

// Drop
const [, dropRef] = useDrop({
  accept: 'CARD',
    hover(item, monitor) {
    const draggedListIndex = item.listIndex;
    const targetListIndex = listIndex;
    // item selecionado
    const draggedIndex = item.index;
    // alvo destino
    const targetIndex = index;

    // Não modificar na mesma posição do card e lista
    if(draggedIndex === targetIndex && draggedListIndex === targetListIndex) {
      return;
    }

    // tamanho elemento
    const targetSize = ref.current.getBoundingClientRect();
    // calc ponto central
    const targetCenter = (targetSize.bottom - targetSize.top) / 2;
    // distância dos pontos (quanto do item foi arrastado encima)
    const draggedOffset = monitor.getClientOffset();
    // calc ((topo dos pontos) - (topo elemento))
    const draggedTop = draggedOffset.y - targetSize.top;

    // Não modificar posição de um item que já anteceda ao outro
    if (draggedIndex < targetIndex && draggedTop < targetCenter) {
      return;
    }
    // Não modificar posição de um item que já preceda ao outro
    if (draggedIndex > targetIndex && draggedTop > targetCenter) {
      return;
    }

      move(draggedListIndex, targetListIndex, draggedIndex, targetIndex);

      item.index = targetIndex;
      item.listIndex = targetListIndex;
    }
  })

  dragRef(dropRef(ref));

  return (
    <Container ref={ ref } isDragging={ isDragging }>
      <header>
        { data.labels.map(label =>  <Label key={ label } color={ label } />) }
      </header>
      <p>{ data.content }</p>
      { data.user && <img src={ data.user } alt='avatar' /> }
    </Container>
  );
};