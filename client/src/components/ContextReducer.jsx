import React, { useReducer, useContext, createContext } from 'react';

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case "ADD":
            return [...state, { id: action.id, name: action.name, qty: action.qty, price:action.price, size: action.size,  img: action.img, description: action.description }]
        case "REMOVE":
            let newArr = [...state]
            newArr.splice(action.index, 1)
            return newArr;
        case "DROP":
            let empArray = []
            return empArray
        case "UPDATE":
    return state.map((food) => {
        if (food.id === action.id) {
            return {
                ...food,
                qty: parseInt(action.qty) + parseInt(food.qty),
                price: parseInt(action.price) + parseInt(food.price),
                description: food.description
            };
        }
        return food;
    });
        
        case "INCREMENT_QTY":
                let incArr = [...state];
                // let price = (incArr[action.index].price/incArr[action.index].qty);
                console.log(incArr[action.index].qty);
                incArr[action.index].qty += 1;  // Increment qty
                console.log(incArr[action.index].qty);
                console.log(action.unitPrice);
                incArr[action.index].price += action.unitPrice;  
                return incArr;
            
        case "DECREMENT_QTY":
                let decArr = [...state];
                if (decArr[action.index].qty > 1) {
                    decArr[action.index].qty -= 1;  // Decrement qty
                    decArr[action.index].price -= action.unitPrice;  // Decrease price by unit price
                }
                return decArr;    
        default:
            console.log("Error in Reducer");
    }
};


export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, []);

    return (
        <CartDispatchContext.Provider value={dispatch}>
            <CartStateContext.Provider value={state}>
                {children}
            </CartStateContext.Provider>
        </CartDispatchContext.Provider>
    )
};

export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);