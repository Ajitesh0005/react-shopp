import { useEffect, useState } from "react";
import axios from "axios";


export function Shopp() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([{ id: 0, title: '', image: '', price: 0, category: '', description: '', rating: { rate: 0, count: 0 } }]);
    const [cartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [showToggle, setShowToggle] = useState({ 'display': 'none' });
    const [totalPrice, setTotalPrice] = useState(0);

    function GetCategories() {
        axios.get("http://fakestoreapi.com/products/categories")
            .then(response => {
                response.data.unshift("all");
                setCategories(response.data);
            })
    }

    function GetProducts(url) {
        axios.get(url)
            .then(response => {
                setProducts(response.data);
            })
    }

    useEffect(() => {
        GetCategories();

        GetProducts("http://fakestoreapi.com/products");

        // GetCartCount();
        // GetToatlPrice();
    },[cartItems])

    function handleCategoryChange(e) {
        if (e.target.value === "all") {
            GetProducts("http://fakestoreapi.com/products");
        } else {
            GetProducts(`http://fakestoreapi.com/products/category/${e.target.value}`);
        }
    }

    function handleAddToCartClick(e) {
        axios.get(`http://fakestoreapi.com/products/${e.target.value}`)
            .then(response => {
                cartItems.push(response.data);
                alert(`${response.data.title}\nadded to Cart`);
                GetCartCount();
                GetToatlPrice();
            })
    }

    function GetCartCount() {
        setCartCount(cartItems.length);
    }

    function handleCartToggleClick() {
        setShowToggle({ 'display': 'block' });
    }

    function handleRemoveClick(e) {
        alert(e.currentTarget.value);
        cartItems.splice(e.currentTarget.value, 1);
        GetCartCount();
        GetToatlPrice();
    }

    function GetToatlPrice() {
        const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);
        setTotalPrice(totalPrice);
    }

    return (
        <div className="container-fluid">
            <header className="d-flex  justify-content-between  p-2  bg-dark  text-white">
                <div className="h3">Shopp.</div>
                <div>
                    <span className="me-4">Home</span>
                    <span className="me-4">Electronics</span>
                    <span className="me-4">Jewelery</span>
                    <span className="me-4">Men's Clothing</span>
                    <span className="me-4">Women's Clothing</span>
                </div>
                <div>
                    <button onClick={handleCartToggleClick} className="btn btn-light position-relative">Your Cart
                        <span className="bi bi-cart4"></span>
                        <span className="badge position-absolute top-0 end-0 bg-danger rounded rounded-circle">{cartCount}</span>
                    </button>
                </div>
            </header>
        
            <section className="mt-3 row">

                <nav className="col-2">
                    <div>
                        <label className="form-label  fw-bold">Select Category</label>
                        <div>
                            <select onChange={handleCategoryChange} className="form-select">
                                {
                                    categories.map(category =>
                                        <option value={category} key={category}>{category.toUpperCase()}</option>
                                    )
                                }
                            </select>
                        </div>
                    </div>
                </nav>

                <main className="col-8 d-flex flex-wrap overflow-auto" style={{ height: '500px' }}>
                    {
                        products.map(product =>
                            <div key={product.id} className="card p-2 m-2" style={{ width: '200px' }}>
                                <img src={product.image} className="card-img-top" height="140" />
                                <div className="card-header overflow-auto" style={{ height: '130px' }}>
                                    <p>{product.title}</p>
                                </div>
                                <div className="card-body">
                                    <dl>
                                        <dt>Price</dt>
                                        <dd><span className="bi bi-currency-dollar"></span>{product.price}</dd>
                                        <dt>Rating</dt>
                                        <dd>
                                            {product.rating.rate}
                                            <span className="bi bi-star-fill  text-success"></span>
                                            [{product.rating.rate}]
                                        </dd>
                                    </dl>
                                </div>
                                <div className="card-footer">
                                    <button onClick={handleAddToCartClick} value={product.id} className="btn btn-danger">
                                        <span className="bi bi-cart4"></span>Add to Cart
                                    </button>
                                </div>
                            </div>
                        )
                    }
                </main>

                <aside className="col-2">
                    <div style={showToggle}>
                        <label className="fw-bold">Your Cart Items</label>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Preview</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    cartItems.map((item, i) =>
                                        <tr key={item.id}>
                                            <td><img src={item.image} width="50" height="50" /></td>
                                            <td>{item.price}</td>
                                            <td>
                                                <button value={i} onClick={handleRemoveClick} className="btn btn-danger">
                                                    <span className="bi bi-trash-fill"></span>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan='2' className="fw-bold text-success">Total Amount</td>
                                    <td className="fw-bold text-success"><span className="bi bi-currency-dollar"></span>{totalPrice}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </aside>
            </section>
        </div>
    )
}
