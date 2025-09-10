let posts = [];
let editingPostId = null;

// Завантаження постів із db.json
async function loadPosts() {
    try {
        const response = await fetch('https://semi-project4-1.onrender.com/posts');
        posts = await response.json();
        renderPosts();
    } catch (error) {
        console.error('Помилка завантаження постів:', error);
    }
}

// Рендеринг постів за допомогою Handlebars
function renderPosts() {
    const source = document.getElementById('post-template').innerHTML;
    const template = Handlebars.compile(source);
    const html = template({ posts });
    document.getElementById('posts').innerHTML = html;
}

// Збереження або оновлення посту
async function savePost() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    if (!title || !content) {
        alert('Заповніть усі поля!');
        return;
    }

    if (editingPostId) {
        // Оновлення існуючого посту
        const post = posts.find(p => p.id === editingPostId);
        post.title = title;
        post.content = content;
        await fetch(`https://semi-project4-1.onrender.com/posts/${editingPostId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post)
        }).catch(error => console.error('Помилка збереження:', error));
        editingPostId = null;
    } else {
        // Створення нового посту
        const newPost = {
            id: Date.now().toString(),
            title,
            content
        };
        posts.push(newPost);
        await fetch('https://semi-project4-1.onrender.com/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPost)
        }).catch(error => console.error('Помилка збереження:', error));
    }

    renderPosts();
    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
    document.querySelector('.post-form button').textContent = 'Опублікувати';
}

// Редагування посту
function editPost(id) {
    const post = posts.find(p => p.id === id);
    document.getElementById('title').value = post.title;
    document.getElementById('content').value = post.content;
    editingPostId = id;
    document.querySelector('.post-form button').textContent = 'Оновити';
}

// Видалення посту
async function deletePost(id) {
    posts = posts.filter(p => p.id !== id);
    await fetch(`https://semi-project4-1.onrender.com/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    }).catch(error => console.error('Помилка видалення:', error));
    renderPosts();
}

// Ініціалізація
loadPosts();
