import React, { useState, useEffect } from 'react';

const GroceryList = () => {
    const [lists, setLists] = useState([]);
    const [currentList, setCurrentList] = useState(null);
    const [newItem, setNewItem] = useState('');
    const [newListName, setNewListName] = useState('');

    useEffect(() => {
        const savedLists = localStorage.getItem('groceryLists');
        if (savedLists) {
            const parsedLists = JSON.parse(savedLists);
            setLists(parsedLists);
            if (parsedLists.length > 0) {
                setCurrentList(parsedLists[0].id);
            }
        }
    }, []);

    const createNewList = (e) => {
        e.preventDefault();
        if (!newListName.trim()) return;

        const newList = {
            id: Date.now(),
            name: newListName,
            date: new Date().toISOString(),
            items: []
        };

        const updatedLists = [...lists, newList];
        setLists(updatedLists);
        setCurrentList(newList.id);
        setNewListName('');
        localStorage.setItem('groceryLists', JSON.stringify(updatedLists));
    };

    const addItem = (e) => {
        e.preventDefault();
        if (!newItem.trim() || !currentList) return;

        const item = {
            id: Date.now(),
            name: newItem,
            completed: false
        };

        const updatedLists = lists.map(list =>
            list.id === currentList
                ? { ...list, items: [...list.items, item] }
                : list
        );

        setLists(updatedLists);
        localStorage.setItem('groceryLists', JSON.stringify(updatedLists));
        setNewItem('');
    };

    const toggleItem = (listId, itemId) => {
        const updatedLists = lists.map(list =>
            list.id === listId
                ? {
                    ...list,
                    items: list.items.map(item =>
                        item.id === itemId
                            ? { ...item, completed: !item.completed }
                            : item
                    )
                }
                : list
        );

        setLists(updatedLists);
        localStorage.setItem('groceryLists', JSON.stringify(updatedLists));
    };

    const deleteItem = (listId, itemId) => {
        const updatedLists = lists.map(list =>
            list.id === listId
                ? {
                    ...list,
                    items: list.items.filter(item => item.id !== itemId)
                }
                : list
        );

        setLists(updatedLists);
        localStorage.setItem('groceryLists', JSON.stringify(updatedLists));
    };

    const deleteList = (listId) => {
        const updatedLists = lists.filter(list => list.id !== listId);
        setLists(updatedLists);
        if (currentList === listId && updatedLists.length > 0) {
            setCurrentList(updatedLists[0].id);
        }
        localStorage.setItem('groceryLists', JSON.stringify(updatedLists));
    };

    const getCurrentList = () => lists.find(list => list.id === currentList);

    return (
        <div className="grocery-app">
            <h1>🛒 My Grocery</h1>

            <div className="list-creation">
                <form onSubmit={createNewList}>
                    <input
                        type="text"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder="Enter new list name..."
                    />
                    <button type="submit">Create New List</button>
                </form>
            </div>

            <div className="lists-container">
                <div className="lists-sidebar">
                    {lists.map(list => (
                        <div
                            key={list.id}
                            className={`list-tab ${currentList === list.id ? 'active' : ''}`}
                            onClick={() => setCurrentList(list.id)}
                        >
                            <span>{list.name}</span>
                            <span className="list-date">
                                {new Date(list.date).toLocaleDateString()}
                            </span>
                            <button
                                className="delete-list"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteList(list.id);
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                {currentList && getCurrentList() && (
                    <div className="current-list">
                        <h2>{getCurrentList().name}</h2>

                        <form onSubmit={addItem}>
                            <input
                                type="text"
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                placeholder="Add new item..."
                            />
                            <button type="submit">Add Item</button>
                        </form>

                        {getCurrentList().items.length === 0 ? (
                            <div className="empty-state">
                                <p>This list is empty. Add some items to get started! 🛍️</p>
                            </div>
                        ) : (
                            <ul>
                                {getCurrentList().items.map(item => (
                                    <li key={item.id}>
                                        <input
                                            type="checkbox"
                                            checked={item.completed}
                                            onChange={() => toggleItem(currentList, item.id)}
                                        />
                                        <span className={item.completed ? 'completed' : ''}>
                                            {item.name}
                                        </span>
                                        <button onClick={() => deleteItem(currentList, item.id)}>
                                            Delete
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroceryList;