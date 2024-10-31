export async function postProduct(product) {
  try {
    const response = await fetch("http://localhost:5000/client/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(product),  
    });

    if (!response.ok) {
      return{status: 500}
    }

    const data = await response.json(); 
    return {data, status: 201};
  } catch (e) {
    console.error("Error al crear el producto:", e);
    return{status: 500}
  }
}

export async function deleteProduct(product_id) {
  try {
    const response = await fetch(`http://localhost:5000/client/products/${product_id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      return{status: 500}
    }

    const data = await response.json(); 
    return {data, status: 200};
  } catch (e) {
    console.error("Error al borrar el producto:", e);
    return{status: 500}
  }
}

export async function postCustomer(customer) {
  try {
    const response = await fetch("http://localhost:5000/client/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(customer),  
    });

    if (!response.ok) {
      return{status: 500}
    }

    const data = await response.json(); 
    return {data, status: 201};
  } catch (e) {
    console.error("Error al crear el usuario:", e);
    return{status: 500}
  }
}

export async function searchUser(user_email) {
  try {
    const response = await fetch(`http://localhost:5000/client/searchUser/${user_email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", 
      },
    });
    console.log(response)
    if (!response.ok) {
      return{status: 500}
    }

    const data = await response.json(); 
    return {data, status: 201};
  } catch (e) {
    console.error("Error al crear el usuario:", e);
    return{status: 500}
  }
}

export async function deleteCustomer(customer_id) {
  try {
    const response = await fetch(`http://localhost:5000/client/users/${customer_id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      return{status: 500}
    }

    const data = await response.json(); 
    return {data, status: 200};
  } catch (e) {
    console.error("Error al borrar el customer:", e);
    return{status: 500}
  }
}

export async function postTransaction(transaction) {
  try {
    const response = await fetch("http://localhost:5000/client/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(transaction),  
    });

    if (!response.ok) {
      return{status: 500}
    }

    const data = await response.json(); 
    return {data, status: 201};
  } catch (e) {
    console.error("Error al crear la transaccion:", e);
    return{status: 500}
  }
}

export async function deleteTransaction(transaction_id) {
  try {
    const response = await fetch(`http://localhost:5000/client/transactions/${transaction_id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      return{status: 500}
    }

    const data = await response.json(); 
    return {data, status: 200};
  } catch (e) {
    console.error("Error al borrar la transacción:", e);
    return{status: 500}
  }
}

export async function updateOrder(order_id, updateObject) {
  console.log(order_id);
  console.log(updateObject);
  try {
    const stringedObject = JSON.stringify(updateObject);
    const response = await fetch(`http://localhost:5000/order/${order_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: stringedObject
    });

    if (!response.ok) {
      return { status: 500 };
    }

    const data = await response.json(); 
    return { data, status: 200 };
  } catch (e) {
    console.error("Error al borrar la transacción:", e);
    return { status: 500 };
  }
}
