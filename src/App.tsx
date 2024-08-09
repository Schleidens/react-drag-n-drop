import { useState } from 'react';

interface Items {
  id: number;
  title: string;
}

function App() {
  const [onProgressItems, setOnProgressItems] = useState<Items[]>([]);
  const [doneItems, setDoneItems] = useState<Items[]>([]);

  const [newItemValue, setNewItemValue] = useState<string>('');

  const [draggingItemId, setDraggingItemId] = useState<number | null>(null);

  const addNewItem = () => {
    if (newItemValue.length > 3) {
      const newItem = { id: Date.now(), title: newItemValue };
      setOnProgressItems([...onProgressItems, newItem]);
      setNewItemValue('');
    }
  };
  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, id: number) => {
    e.dataTransfer.setData('item_id', id.toString());
    setDraggingItemId(id);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLUListElement>,
    toDone: boolean
  ) => {
    e.preventDefault();

    const id = e.dataTransfer.getData('item_id');
    const source = toDone ? onProgressItems : doneItems;
    const setSource = toDone ? setOnProgressItems : setDoneItems;
    const target = toDone ? doneItems : onProgressItems;
    const setTarget = toDone ? setDoneItems : setOnProgressItems;

    const card = source.find((i) => i.id === parseInt(id, 10));

    if (card) {
      setTarget([...target, card]);
      setSource(source.filter((i) => i.id !== parseInt(id)));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLUListElement>) => {
    e.preventDefault();
    setDraggingItemId(null);
  };

  const handleDragEnd = () => {
    setDraggingItemId(null);
  };
  return (
    <div id='app'>
      <main className='main'>
        <section className='on__progress'>
          <h2>On progress</h2>
          <ul
            onDrop={(e) => handleDrop(e, false)}
            onDragOver={handleDragOver}
          >
            {onProgressItems.map((item) => {
              return (
                <li
                  className={`item ${
                    draggingItemId === item.id ? 'dragging' : ''
                  }`}
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDragEnd={handleDragEnd}
                >
                  {item.title}
                </li>
              );
            })}
          </ul>
          <div className='form'>
            <input
              type='text'
              placeholder='Add a new item'
              value={newItemValue}
              onChange={(e) => setNewItemValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addNewItem()}
            />
            <button onClick={addNewItem}>Add</button>
          </div>
        </section>
        <section className='done'>
          <h2>Done</h2>
          <ul
            onDrop={(e) => handleDrop(e, true)}
            onDragOver={handleDragOver}
          >
            {doneItems.map((item) => {
              return (
                <li
                  className={`item ${
                    draggingItemId === item.id ? 'dragging' : ''
                  }`}
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDragEnd={handleDragEnd}
                >
                  {item.title}
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
