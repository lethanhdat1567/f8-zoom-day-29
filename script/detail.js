const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const productDetailBody = $(".product-detail");
const reviewsEle = $(".reviews");
// Get ID params
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
// State
let activeThumbnail = 0;
let productImgs = [];

async function httpRequest(method, url) {
    const res = await fetch(url, { method });

    if (!res.ok) throw new Error(`Error code: ${res.status}`);
    const type = res.headers.get("content-type");
    const isJSON = type && type.includes("application/json");

    return isJSON ? res.json() : res.text();
}
let imgsEle = null;

async function renderProductDetail() {
    try {
        const productDetail = await httpRequest(
            "GET",
            `https://dummyjson.com/products/${id}`
        );

        productImgs = productDetail.images;

        const html = `<div class="product-image">
                    <div class="thumbnail-wrap">
                        <img
                            src="${productImgs[activeThumbnail]}"
                            alt="${productDetail.title}"
                            class="thumbnail"
                        />
                        <div class="imgs">
                        ${productImgs
                            .map((img, index) => {
                                return `<img src="${img}" class="sub-img ${
                                    Number(activeThumbnail) === index
                                        ? "active"
                                        : ""
                                }" data-index="${index}" />`;
                            })
                            .join("")}
                        </div>
                    </div>
                </div>
                <div class="product-info">
                    <h1>${productDetail.title}</h1>
                    <p class="price">
                        $${
                            productDetail.discountPercentage
                        } <span class="discount">$${productDetail.price}</span>
                    </p>
                    <p class="rating">Rating: ${productDetail.rating} ★★★</p>
                    <p class="stock">Availability: In Stock (${
                        productDetail.stock
                    } units)</p>
                    <p class="description">
                       ${productDetail.description}
                    </p>
                    <div class="details">
                        <p><strong>Brand:</strong> ${productDetail.brand}</p>
                        <p><strong>Category:</strong> ${
                            productDetail.category
                        }</p>
                        <p><strong>SKU:</strong> ${productDetail.sku}</p>
                        <p><strong>Weight:</strong> ${productDetail.weight}</p>
                        <p>
                            <strong>Dimensions:</strong> ${
                                productDetail.dimensions.width
                            }cm x ${productDetail.dimensions.height}cm x
                            ${productDetail.dimensions.depth}cm
                        </p>
                        <p><strong>Warranty:</strong> ${
                            productDetail.warrantyInformation
                        }</p>
                        <p><strong>Shipping:</strong> ${
                            productDetail.shippingInformation
                        }</p>
                        <p>
                            <strong>Return Policy:</strong> ${
                                productDetail.returnPolicy
                            }
                        </p>
                        <p><strong>Minimum Order Quantity:</strong> ${
                            productDetail.minimumOrderQuantity
                        }</p>
                    </div>
                </div>`;

        // Reviews
        const reviews = productDetail.reviews;
        const reviewHtml = reviews
            .map((review) => {
                return `<div class="review">
                    <div class="review-head">
                        <p class="review-head-left"><strong>${
                            review.reviewerName
                        }</strong> ${handleReviewStar(review.rating)}(${
                    review.rating
                })</p>
                        <p class="review-date">${formatDateSimple(
                            review.date
                        )}</p>
                    </div>
                    <p class="review-content">${review.comment}</p>
                </div>`;
            })
            .join("");

        productDetailBody.innerHTML = html;
        reviewsEle.innerHTML = reviewHtml;

        imgsEle = $$(".sub-img");
        imgsEle.forEach((imgItem) => {
            imgItem.onclick = () => {
                const index = imgItem.dataset.index;
                activeThumbnail = index;

                renderProductDetail();
            };
        });
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

renderProductDetail();

function handleReviewStar(starNum) {
    const star = "★";
    return star.repeat(starNum);
}

function formatDateSimple(isoString) {
    const date = new Date(isoString);

    date.setHours(date.getHours() + 7);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
