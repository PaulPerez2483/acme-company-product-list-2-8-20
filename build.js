const { Component, createElement} = React;
const { render } = ReactDOM;
const root = document.getElementById('root');

const Nav = (props) => {
    const {companies, products, view} = props;
    console.log(view)
    let a1 = createElement('a', {href:'#products', className: view === 'products' ? 'active' : null}, `products ${products.length}`);
    let a2 = createElement('a', {href:'#companies', className: view === 'companies' ? 'active' : null}, `companies ${companies.length}`);
    return createElement('nav', {className:'nav'}, a1, a2);
}

const ProductsList = (props) => {
    const { products } = props;
    console.log(products)
    const divs = products.map(product => createElement('li',{className:"product-child", key: product.name},  `${product.name} - ${product.description}`));
    return createElement('ul', {className:"product-parent"}, divs)
}

const CompaniesList = (props) => {
    const {companies} = props;
    console.log(companies)
    const divs = companies.map(company => createElement('li', {className:"company-child", key: company.name}, company.name ));
    return createElement('ul', {className:"company-parent"}, divs);
}

class App extends Component {
    constructor(){
        super();
        this.state = {
            products: [],
            companies: [],
            view: 'products',
            loading: true
        }
    }

    componentDidMount(){

        const companies_api = 'https://acme-users-api-rev.herokuapp.com/api/companies';
        const products_api = 'https://acme-users-api-rev.herokuapp.com/api/products';
    
        const request_companies = axios.get(companies_api);
        const request_products = axios.get(products_api);
    
        axios.all([request_companies, request_products])
        .then(axios.spread((...responses) => {
            const resCompanies = responses[0];
            const resProducts = responses[1];
            this.setState({
                products: resProducts.data,
                companies: resCompanies.data,
                loading: !this.state.loading,
            })
          })).catch(errors => {
            console.log(errors) // if any errors
          });

          window.addEventListener('hashchange', (e)=> {
            let currentLocation = window.location.hash.slice(1);
             console.log(currentLocation)
            if(currentLocation === 'products') {
                this.setState({
                    view: 'products'
                })
            }
            if(currentLocation === 'companies') {
                this.setState({
                    view: 'companies'
                })
            }
        })

        let currentLocation = window.location.hash.slice(1);
        this.setState({view:currentLocation})

         
    }


    render(){

        const {products, companies, view, loading} = this.state;

        console.log(view)
    
        if(loading) return createElement('div', {className: "loading"}, 'fetching Data');

        const nav = createElement(Nav, {companies, products, view});

        let chosenView;

        if (view === 'products') {
            chosenView = createElement( ProductsList, { products });
        }
        else if (view === 'companies') {
            chosenView = createElement( CompaniesList, { companies });
        }

        return createElement('div', null, nav, chosenView)
    }
}

render(createElement(App), root);


