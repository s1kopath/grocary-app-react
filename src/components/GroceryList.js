import React, { useState, useEffect } from 'react';

const GroceryList = () => {
    // Initialize state with data from localStorage
    const [items, setItems] = useState(() => {
        const savedItems = localStorage.getItem('groceryItems');
        return savedItems ? JSON.parse(savedItems) : [];
    });

    const [newItem, setNewItem] = useState('');

    // Save to localStorage whenever items change
    useEffect(() => {
        localStorage.setItem('groceryItems', JSON.stringify(items));
    }, [items]);

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItem.trim()) return;
        
        const item = {
            id: Date.now(),
            name: newItem,
            completed: false
        };
        
        setItems([...items, item]);
        setNewItem('');
    };

    const handleDeleteItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const toggleComplete = (id) => {
        setItems(items.map(item => 
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    return (
        <div className="grocery-list">
            <form onSubmit={handleAddItem}>
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add new item..."
                />
                <button type="submit">Add Item</button>
            </form>

            <ul>
                {items.map(item => (
                    <li key={item.id}>
                        <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => toggleComplete(item.id)}
                        />
                        <span style={{ 
                            textDecoration: item.completed ? 'line-through' : 'none' 
                        }}>
                            {item.name}
                        </span>
                        <button onClick={() => handleDeleteItem(item.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GroceryList;