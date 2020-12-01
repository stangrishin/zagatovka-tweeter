document.addEventListener('click', async (event) => {
  if (event.target.id === 'showInput') {
    event.preventDefault();
    const inputForm = document.querySelector('.hide');
    inputForm.style.display = 'block';
  }
  if (event.target.id === 'likeImg') {
    const articleID = event.target.closest('article').id;
    const response = await fetch('/addLike', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ articleID }),
    });
    const result = await response.json();
    const counter = document.querySelector(`#counter${articleID}`);
    counter.innerText = result.newPost;
  }
  // if (event.target.id === 'edit') {
  //   const articleID = event.target.closest('article').id;

  // }
  if (event.target.id === 'delete') {
    const articleID = event.target.closest('article').id;
    const response = await fetch('/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ articleID }),
    });
    if (response.status === 200) {
      const deletePost = event.target.closest('article');
      deletePost.style.display = 'none';
    }
  }
});
