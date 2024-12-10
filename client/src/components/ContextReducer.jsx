import React, { useReducer, useContext, createContext, useEffect } from 'react';

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case "ADD":
            return [...state, { id: action.id, name: action.name, qty: action.qty, price: action.price, size: action.size, img: action.img, description: action.description }];
        case "REMOVE":
            let newArr = [...state];
            newArr.splice(action.index, 1);
            // Update localStorage immediately after removing an item
            localStorage.setItem("cart", JSON.stringify(newArr));
            return newArr;
        case "DROP":
            // Empty cart and clear localStorage
            localStorage.removeItem("cart");
            return [];
        case "UPDATE":
            return state.map((food) => {
                if (food.id === action.id) {
                    return {
                        ...food,
                        qty: parseInt(action.qty) + parseInt(food.qty),
                        price: parseInt(action.price) + parseInt(food.price),
                    };
                }
                return food;
            });
        case "INCREMENT_QTY":
            let incArr = [...state];
            incArr[action.index].qty += 1;
            incArr[action.index].price += action.unitPrice;
            localStorage.setItem("cart", JSON.stringify(incArr));
            return incArr;
        case "DECREMENT_QTY":
            let decArr = [...state];
            if (decArr[action.index].qty > 1) {
                decArr[action.index].qty -= 1;
                decArr[action.index].price -= action.unitPrice;
            }
            localStorage.setItem("cart", JSON.stringify(decArr));
            return decArr;
        default:
            console.log("Error in Reducer");
            return state;
    }
};

// CartProvider to manage state and provide it to components
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, [], () => {
        // Load initial state from localStorage or return an empty array if none exists
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : [];
    });

    // Persist cart data to localStorage whenever state changes
    useEffect(() => {
        if (state.length > 0) {
            localStorage.setItem("cart", JSON.stringify(state));
        }
    }, [state]);

    return (
        <CartDispatchContext.Provider value={dispatch}>
            <CartStateContext.Provider value={state}>
                {children}
            </CartStateContext.Provider>
        </CartDispatchContext.Provider>
    );
};

// Custom hooks to access cart state and dispatch
export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);
