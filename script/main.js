const $ = document.querySelector.bind(document);

const productBody = $(".product-grid");

async function httpRequest(method, url) {
    const res = await fetch(url, { method });

    if (!res.ok) throw new Error(`Error code: ${res.status}`);
    const type = res.headers.get("content-type");
    const isJSON = type && type.includes("application/json");

    return isJSON ? res.json() : res.text();
}

async function renderProducts() {
    try {
        const productsData = await httpRequest(
            "GET",
            "https://dummyjson.com/products"
        );

        const html = productsData.products
            .map((product) => {
                return `<div class="card">
                            <img
                                src="${product.thumbnail}"
                                alt="${product.title}"
                                class="card-img"
                            />
                            <div class="card-body">
                                <h2 class="card-title">
                                    ${product.title}
                                </h2>
                                <p class="card-text">
                                    ${product.description}
                                </p>
                                <div class="card-wrap">
                                    <p class="card-price">$${product.discountPercentage}</p>
                                    <p class="card-price discount">$${product.price}</p>
                                </div>
                                <div class="card-footer">
                                    <p class="card-stock">
                                        In Stock: (${product.stock} units)
                                    </p>
                                    <p class="card-rating">${product.rating} ★★★</p>
                                </div>
                                <a href="./detail.html?id=${product.id}"><button class="btn">Add to Cart</button></a>
                            </div>
                        </div>`;
            })
            .join("");

        productBody.innerHTML = html;
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

renderProducts();
