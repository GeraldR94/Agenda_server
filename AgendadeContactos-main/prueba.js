
const formTodo = document.querySelector('#form-todos');
const formInput = document.querySelector('#form-input');
const todosList = document.querySelector('#todos-list');
const closeBtn = document.querySelector('#cerrar-btn');
const user = JSON.parse(localStorage.getItem('user'));

(() =>{
    if (!user){
        window.location.href = '../home/index.html';
    }
})()

formTodo.addEventListener('submit', async e =>{
    e.preventDefault();
    const responseJSON = await fetch('http://localhost:3000/todos', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({Text: formInput.value, user: user.username, cheked: false}),
         });

    const response = await responseJSON.json();
    console.log(response);
    
    const listItem = document.createElement('li');
    listItem.innerHTML = `
    <li class="todo-item" id="${response.id}">
        <button class="delete-btn">&#10006;</button>
        <p>${response.Text}</p>
        <button class="check-btn">&#10003;</button>
    </li>
    `;
    todosList.append(listItem);
    formInput.value = '';
});

const getTodos = async () => {
    const response = await fetch('http://localhost:3000/todos', {method: 'GET'});
    const todos = await response.json();
    const userTodos = todos.filter(todo => todo.user === user.username);
    userTodos.forEach(todo => {
        const listItem = document.createElement('li');
    listItem.innerHTML = `
    <li class="todo-item" id="${todo.id}">
        <button class="delete-btn">&#10006;</button>
        <p ${todo.cheked ? 'class="check-todo"' : null} >${todo.Text}</p>
        <button class="check-btn">&#10003;</button>
    </li>
    `;
    todosList.append(listItem);
    })
}

getTodos();

todosList.addEventListener('click', async e =>{
    if (e.target.classList.contains('delete-btn')) {
       const id = e.target.parentElement.id;
       
        await fetch(`http://localhost:3000/todos/${id}`, {method: 'DELETE'});
        e.target.parentElement.remove();
    } else if (e.target.classList.contains('check-btn')){
        const id = e.target.parentElement.id;
        await fetch(`http://localhost:3000/todos/${id}`, { 
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({cheked: e.target.parentElement.children[1].classList.contains('check-todo') ? false : true}),
         });
        e.target.parentElement.children[1].classList.toggle('check-todo');

    }
});

closeBtn.addEventListener('click', async e =>{
    localStorage.removeItem('user');
    window.location.href = '../home/index.html';
});
