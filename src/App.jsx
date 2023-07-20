import Dashboard from "./pages/Dashboard";
import Shop from "./pages/Shop";
import Category from "./pages/Category";
import Catelog from "./pages/Catelog";
import Users from "./pages/Users";
import News from "./pages/News";
import Order from "./pages/Orders";
import Vender from "./pages/Venders";
import Stocks from "./pages/Stock";
import Pages from "./pages/Pages";
import PageItems from "./pages/PageItems";
import Main from "./layouts/Main";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import NewShop from "./pages/NewShop";
import SubCategoryLevel1 from "./pages/SubCategoryLevel1";
import SubCategoryLevel2 from "./pages/SubCategoryLevel2";
import SubCategoryLevel3 from "./pages/SubCategoryLevel3";
import SubCategoryLevel4 from "./pages/SubCategoryLevel4";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Main />}>
          <Route index element={<NewShop />} />
          <Route exact path="/shop" element={<NewShop />} />
          <Route exact path="/catelog" element={<Catelog />} />
          <Route path="/catelog/pages" element={<Pages />} />
          <Route path="/catelog/pages/items" element={<PageItems />} />
          <Route exact path="/category" element={<Category />} />
          <Route
            exact
            path="/sub-category-level-one"
            element={<SubCategoryLevel1 />}
          />
          <Route
            exact
            path="/sub-category-level-two"
            element={<SubCategoryLevel2 />}
          />
          <Route
            exact
            path="/sub-category-level-three"
            element={<SubCategoryLevel3 />}
          />
          <Route
            exact
            path="/sub-category-level-four"
            element={<SubCategoryLevel4 />}
          />
          <Route exact path="/users" element={<Users />} />
          <Route exact path="/news" element={<News />} />
          <Route exact path="/orders" element={<Order />} />
          <Route exact path="/stocks" element={<Stocks />} />
          <Route exact path="/vender" element={<Vender />} />
        </Route>
        <Route exact path="/login" element={<Login />} />
        {/* <Route exact path="/" element={<Dashboard/>}/> */}
      </Routes>
    </Router>
  );
}

export default App;
