const categoryList = document.querySelector('.categories');
const productList = document.querySelector('.products');
const modal = document.querySelector('.modal-wrapper');
const openBtn = document.querySelector('#open-btn');
const closeBtn = document.querySelector('#close-btn');
const modalList = document.querySelector('.modal-list');
const modalInfo = document.querySelector('#modal-info');

document.addEventListener('DOMContentLoaded', () => {
  fetchCategories();
  fetchProduct();
});

function fetchCategories() {
  fetch('https://api.escuelajs.co/api/v1/categories')
    .then((res) => res.json())
    .then((data) =>
      data.slice(0, 4).forEach((category) => {
        const { image, name } = category;
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');
        categoryDiv.innerHTML = `
            <img src="${image}" />
            <span>${name}</span>
        `;
        // oluşan divi htmldeki listeye atma
        categoryList.appendChild(categoryDiv);
      })
    );
}

// Ürünleri Çekme
function fetchProduct() {
  fetch('https://api.escuelajs.co/api/v1/products')
    .then((res) => res.json())
    .then((data) =>
      data.slice(0, 25).forEach((item) => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${item.images[0]}" />
            <p>${item.title}</p>
            <p>${item.category.name}</p>
            <div class="product-action">
              <p>${item.price} $</p>
              <button onclick="addToBasket({id:${item.id},title:'${item.title}',price:${item.price},img:'${item.images[0]}', amount:1})">Sepete Ekle</button>
            </div>
        `;
        // oluşan ürünü htmldeki listeye gönderme
        productList.appendChild(productDiv);
      })
    );
}

// Sepet
let basket = [];
let total = 0;

// sepete ekleme işlemi
function addToBasket(product) {
  const foundItem = basket.find((basketItem) => basketItem.id === product.id);

  if (foundItem) {
    foundItem.amount++;
  } else {
    basket.push(product);
  }
}

// Açma ve Kapatma

openBtn.addEventListener('click', () => {
  modal.classList.add('active');
  // sepetin içine ürünleri listeleme
  addList();
  // toplam bilgisini güncelleme
  modalInfo.innerText = total;
});

closeBtn.addEventListener('click', () => {
  modal.classList.remove('active');
  // sepeti kaptınca içini temizleme
  modalList.innerHTML = '';
  total = 0;
});

// sepete listeleme fonksiyonu
function addList() {
  basket.forEach((product) => {
    console.log(product);
    const listItem = document.createElement('div');
    listItem.classList.add('list-item');
    listItem.innerHTML = `
              <img src="${product.img}" />
              <h2>${product.title}</h2>
              <h2 class="price">${product.price}  $</h2>
              <p>Miktar: ${product.amount}</p>
              <button id="del" onclick="deleteItem({id:${product.id},price:${product.price} ,amount: ${product.amount}})">Sil</button>
    `;
    // elemanı htmldeki listeye gönderme
    modalList.appendChild(listItem);

    // toplam değişkenini güncelleme
    total += product.price * product.amount;
  });
}

// sepet dizisinden silme fonksiyonu
function deleteItem(deletingItem) {
  basket = basket.filter((i) => i.id !== deletingItem.id);
// totelden çıkarma
  total -= deletingItem.price * deletingItem.amount;

  modalInfo.innerText = total;
}

// silinen elemanı htmlden kaldırma
modalList.addEventListener('click', (e) => {
  if (e.target.id === 'del') {
    e.target.parentElement.remove();
  }
});

// eğer dışarıya tıklanırsa kapatma
modal.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-wrapper')) {
    modal.classList.remove('active');
  }
});