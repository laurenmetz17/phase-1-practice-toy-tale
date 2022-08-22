let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetch("http://localhost:3000/toys").then(resp => resp.json()).then(toys => renderToys(toys));

  let toyForm = document.querySelector('form');
  toyForm.addEventListener('submit', createNewToy);
});


function renderToys(toys) {
  toys.forEach(toy => {
    let toyCard = document.createElement('div');
    toyCard.classList.add('card');
    let toyName = document.createElement('h2')
    toyName.textContent = toy.name;
    toyCard.append(toyName);
    let toyImg = document.createElement('img');
    toyImg.src = toy.image;
    toyImg.classList.add('toy-avatar');
    toyCard.append(toyImg);
    let likes = document.createElement('p');
    likes.textContent = toy.likes;
    toyCard.append(likes);
    let liker = document.createElement('button');
    liker.id = toy.id;
    liker.classList.add('like-btn');
    liker.textContent = 'Like ❤️'
    liker.addEventListener('click', handleLike);
    toyCard.append(liker);
    document.querySelector('#toy-collection').append(toyCard);
  })
}

function createNewToy(e) {
  e.preventDefault();
  fetch('http://localhost:3000/toys', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      name: document.querySelector('input[name = "name"]').value,
      image: document.querySelector('input[name = "image"]').value,
      likes: 0
    })
  }).then(resp => resp.json())
  .then(obj => {
    document.querySelector('#toy-collection').append(obj);
    document.querySelector('input[name = "name"]').value = '';
    document.querySelector('input[name = "image"]').value = '';
  });
}

function handleLike(e) {
  let toyId = e.target.id;
  fetch(`http://localhost:3000/toys/${toyId}`).then(resp => resp.json())
  .then(toy => {
    //toyLikes not actively updating on the DOM, dont know if its becuase of the patch request or the placement of the event listener
    console.log(document.querySelector('#toy-collection').children[toyId].querySelector('p').textContent);
    let likeNum = toy.likes + 1;
    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: 'PATCH',
      headers:{
        "Content-Type": "application/json",
        Accept: "application/json"
      }, 
      body: JSON.stringify({
        "likes": likeNum
      })
    }).then(resp => resp.json()).then(obj => {
      let toyLikes = document.querySelector('#toy-collection').children[toyId].querySelector('p');
      toyLikes.textContent = parseInt(toyLikes.textContent,10) + 1;
    })
  });
}
