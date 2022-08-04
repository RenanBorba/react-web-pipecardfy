<div align="center"> 

# Projeto - Aplicação Pipecardfy Web ReactJS

</div>

<br>

<div align="center">

[![Generic badge](https://img.shields.io/badge/Made%20by-Renan%20Borba-purple.svg)](https://shields.io/) [![Build Status](https://img.shields.io/github/stars/RenanBorba/react-web-pipecardfy.svg)](https://github.com/RenanBorba/react-web-pipecardfy) [![Build Status](https://img.shields.io/github/forks/RenanBorba/react-web-pipecardfy.svg)](https://github.com/RenanBorba/react-web-pipecardfy) [![made-for-VSCode](https://img.shields.io/badge/Made%20for-VSCode-1f425f.svg)](https://code.visualstudio.com/) [![Open Source Love svg2](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)

<br>

![pipe](https://user-images.githubusercontent.com/48495838/85883629-abf3c800-b7b7-11ea-8768-2246ccb59000.png)

</div>

<br>

Aplicação Front-end desenvolvida em ReactJS para clone do app Pipefy web, voltada para organização de tarefas, permitindo interação de arraste (drag n'drop) entre os cards nas listas de tarefas.

<br><br>

<div align="center">

![pipe](https://user-images.githubusercontent.com/48495838/84696372-c8277780-af22-11ea-8588-15a50f3ae4f9.png)

</div>

<br><br>

## :rocket: Tecnologias
<ul>
  <li>Components</li>
  <li>Server API fake</li>
  <li>react-dnd</li>
  <li>useDrag</li>
  <li>react-dnd-html5-backend</li>
  <li>DndProvider</li>
  <li>useDrop</li>
  <li>useRef</li>
  <li>createContext</li>
  <li>useContext</li>
  <li>useState</li>
  <li>Immer</li>
  <li>react-icons</li>
  <li>styled-components</li>
  <li>Multiple CSS properties</li>
</ul>

<br><br>

## :arrow_forward: Start
<ul>
  <li>npm install</li>
  <li>npm run start / npm start</li>
</ul>

<br><br>

## :punch: Como contribuir
<ul>
  <li>Dê um fork nesse repositório</li>
  <li>Crie a sua branch com a feature</li>
    <ul>
      <li>git checkout -b my-feature</li>
    </ul>
  <li>Commit a sua contribuição</li>
    <ul>
      <li>git commit -m 'feat: My feature'</li>
    </ul>
  <li>Push a sua branch</li>
    <ul>
      <li>git push origin my-feature</li>
    </ul>
</ul>
<br><br><br>

## :mega: ⬇ Abaixo as principais estruturas e interface principal:

<br><br>
<br>

## src/App.js
```js
import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import GlobalStyle from './styles/global';
import Header from './components/Header';
import Board from './components/Board';

function App() {
  return (
    // API dnd do html5
    <DndProvider backend={ HTML5Backend }>
      <Header />
      <Board />

      <GlobalStyle />
    </DndProvider>
  )
};

export default App;
```

<br><br>

## src/components/Board/index.js
```js
import React, { useState } from 'react';
import produce from 'immer';

import { loadLists } from '../../services/api';
import BoardContext from './context';
import List from '../List';
import { Container } from './styles';

const data = loadLists();

export default function Board() {
  const [lists, setLists] = useState(data);

  function move(fromList, toList, from, to) {
    setLists(produce(lists, draft => {
      const dragged = draft[fromList].cards[from];

      draft[fromList].cards.splice(from, 1);
      draft[toList].cards.splice(to, 0, dragged);
    }));
  }

  return (
    <BoardContext.Provider value={{ lists, move }}>
      <Container>
        { lists.map((list, index) =>
          <List key={ list.title }
            index={ index }
            data={ list } />)
        }
      </Container>
    </BoardContext.Provider>
  );
};
```

<br><br>


## src/components/List/index.js
```js
import React from 'react';

import { MdAdd } from 'react-icons/md';
import { Container } from './styles';
import Card from '../Card';

export default function List({ data, index: listIndex }) {
  return (
    <Container done={ data.done }>
      <header>
        <h2>{ data.title }</h2>
          { data.creatable && (
            <button type='button'>
              <MdAdd size={24} color="#FFF" />
            </button>
          )}
      </header>

      <ul>
        { data.cards.map((card, index) => (
          <Card key={ card.id }
            listIndex={ listIndex }
            index={ index }
            data={ card }
          />
        ))}
      </ul>
    </Container>
  );
};
```

<br><br>


## src/components/Card/index.js
```js
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
```

<br><br>

## Interface principal

![3](https://user-images.githubusercontent.com/48495838/68239279-73656b00-ffe9-11e9-89d3-a405f7ccc074.JPG)

<br><br>

![3 5](https://user-images.githubusercontent.com/48495838/68776019-28ada980-060e-11ea-8d69-edb2d77344d3.JPG)

<br><br>

![5](https://user-images.githubusercontent.com/48495838/68239425-b32c5280-ffe9-11e9-8d54-f03da8596d7c.JPG)
