// Obtener elementos del DOM
const productForm = document.getElementById('productForm');
const productName = document.getElementById('productName');
const productCategory = document.getElementById('productCategory');
const productPrice = document.getElementById('productPrice');
const productList = document.getElementById('productList');

const viewAllBtn = document.getElementById('viewAll');
const filterUnder100Btn = document.getElementById('filterUnder100');
const filterAbove100Btn = document.getElementById('filterAbove100');

// Función para obtener los productos del localStorage
const getProductsFromStorage = () => {
    try {
        const products = localStorage.getItem('products');
        return products ? JSON.parse(products) : [];
    } catch (error) {
        displayError('Error al obtener productos desde el almacenamiento local.');
        return [];
    }
};

// Función para guardar productos en localStorage
const saveProductsToStorage = (products) => {
    try {
        // Asegurar que todos los productos tengan propiedades válidas
        const validatedProducts = products.map(product => ({
            name: product.name || 'Producto sin nombre',
            category: product.category || 'Sin categoría',
            price: product.price || 0
        }));
        localStorage.setItem('products', JSON.stringify(validatedProducts));
    } catch (error) {
        displayError('Error al guardar productos en el almacenamiento local.');
    }
};




// Función para mostrar productos
const renderProducts = (products) => {
    productList.innerHTML = '';
    products.forEach(({ name = 'Producto sin nombre', category = 'Sin categoría', price = 0 }) => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product', 'bg-gray-200', 'p-4', 'rounded-md', 'mb-4');
        productDiv.innerHTML = `
            <h3 class="text-lg font-semibold">${name}</h3>
            <p>Categoría: ${category}</p>
            <p>Precio: $${price.toFixed(2)}</p>
        `;
        productList.appendChild(productDiv);
    });
};

// Función para agregar producto
const addProduct = (e) => {
    e.preventDefault();

    const newProduct = {
        name: productName.value.trim(),
        category: productCategory.value.trim(),
        price: parseFloat(productPrice.value.trim())
    };

    // Validación básica
    if (!newProduct.name || !newProduct.category || isNaN(newProduct.price)) {
        displayError("Todos los campos son requeridos y el precio debe ser un número.");
        return;
    }

    const products = getProductsFromStorage();
    products.push(newProduct);
    saveProductsToStorage(products);

    // Limpiar formulario
    productName.value = '';
    productCategory.value = '';
    productPrice.value = '';

    renderProducts(products);
};

// Función para mostrar errores en el DOM
const displayError = (message) => {
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('bg-red-500', 'text-white', 'p-3', 'rounded-md', 'mb-4');
    errorDiv.innerText = message;
    document.body.prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000); // Eliminar el mensaje después de 5 segundos
};

// Fetch simulando obtener productos de una API
const fetchProducts = async () => {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) throw new Error('Error al obtener productos desde la API');
        const products = await response.json();

        // Asegurar que los datos de la API tengan propiedades válidas
        const validatedProducts = products.map(product => ({
            name: product.title || 'Producto sin nombre',
            category: product.category || 'Sin categoría',
            price: product.price || 0
        }));

        saveProductsToStorage(validatedProducts);
        renderProducts(validatedProducts);
    } catch (error) {
        displayError(error.message);
    }
};

// Eventos para las acciones
viewAllBtn.addEventListener('click', () => {
    const products = getProductsFromStorage();
    renderProducts(products);
});

filterUnder100Btn.addEventListener('click', () => {
    const products = getProductsFromStorage();
    const filteredProducts = products.filter(product => product.price < 100);
    renderProducts(filteredProducts);
});

filterAbove100Btn.addEventListener('click', () => {
    const products = getProductsFromStorage();
    const filteredProducts = products.filter(product => product.price > 100);
    renderProducts(filteredProducts);
});

// Evento de agregar producto
productForm.addEventListener('submit', addProduct);

// Inicializar vista con productos almacenados
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts(); // Simula cargar productos desde una API
});
