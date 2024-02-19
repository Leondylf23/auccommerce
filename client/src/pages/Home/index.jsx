import { useEffect, useState } from 'react';
import { useDispatch, connect } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { Button } from '@mui/material';
import BestSellerCard from '@components/BestSellerCard';

import ProductCard from '@components/ProductCard';
import { getUserDataDecrypt } from '@utils/allUtils';
import { selectUserData } from '@containers/Client/selectors';

import { getBestSeller, getMyProductsData, getProductsData } from './actions';
import { selectBestData, selectProductData } from './selectors';
import clasess from './style.module.scss';

const Home = ({ products, userData, best }) => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  const [data, setData] = useState([]);
  const [isBusiness, setIsBusiness] = useState(false);
  const [search, setSearch] = useState('');
  const [isMore, setIsMore] = useState(false);

  const getProductFromApi = () => {
    setSearchParams({});
    const user = getUserDataDecrypt(userData);
    if (user && user?.role === 'business') {
      setIsBusiness(true);
      dispatch(getMyProductsData());
    } else {
      setIsBusiness(false);
      dispatch(getProductsData());
    }
  };

  const getProductSearch = (query) => {
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
    const user = getUserDataDecrypt(userData);
    if (user && user?.role === 'business') {
      setIsBusiness(true);
      dispatch(getMyProductsData({ ...(query !== '' && { productName: query, page }) }));
    } else {
      setIsBusiness(false);
      dispatch(getProductsData({ ...(query !== '' && { productName: query, page }) }));
    }
  };

  const handleSearch = () => {
    setData([]);
    getProductSearch(search);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 6);
    getProductSearch();
  };

  useEffect(() => {
    if (products) {
      setData((prev) => [...prev, ...products]);
      setIsMore(products.length >= 6);
    }
  }, [products]);

  useEffect(() => {
    dispatch(getBestSeller());
    getProductSearch();
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery) {
      setSearch(searchQuery);
      getProductSearch(searchQuery);
    }
  }, []);

  return (
    <div className={clasess.mainContainer}>
      <h1 className={clasess.title}>
        <FormattedMessage id="home_title" />
      </h1>

      {isBusiness && (
        <div className={clasess.createBtnContainer}>
          <button type="button" className={clasess.button} onClick={() => navigate('/product-creation')}>
            <FormattedMessage id="home_create_new" />
          </button>
        </div>
      )}

      <div className={clasess.searchContainer}>
        <h4 className={clasess.title}>
          <FormattedMessage id="home_title" />
        </h4>
        <div className={clasess.debounce}>
          <div className={clasess.resetInput}>
            <input
              type="text"
              className={clasess.input}
              value={search}
              placeholder={intl.formatMessage({ id: 'home_search_placeholder' })}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <ClearIcon
                onClick={() => {
                  getProductFromApi();
                  setSearch('');
                }}
                className={clasess.reset}
              />
            )}
          </div>
          <Button variant="contained">
            <SearchIcon onClick={() => handleSearch()} />
          </Button>
        </div>
      </div>
      {best.length !== 0 && (
        <>
          <h3 className={clasess.title}>
            <FormattedMessage id="home_best" />
          </h3>
          <div className={clasess.bestSeller}>
            {best.map((item, idx) => (
              <BestSellerCard key={idx} data={item} />
            ))}
          </div>
        </>
      )}
      <div className={clasess.dataContainer}>
        {data.length > 0 ? (
          <>
            <div className={clasess.dataGrid}>
              <div className={clasess.innerDataGrid}>
                {data.map((product, idx) => (
                  <ProductCard data={product} isBusiness={isBusiness} key={idx} />
                ))}
              </div>
            </div>
            {isMore && (
              <div className={clasess.loadMore}>
                <Button variant="contained" onClick={handleLoadMore}>
                  Load more
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className={clasess.empty}>
            <h3>
              <FormattedMessage id="empty_data" />
            </h3>
            <div onClick={getProductFromApi}>
              <FormattedMessage id="back" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Home.propTypes = {
  userData: PropTypes.string,
  products: PropTypes.array,
  best: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  userData: selectUserData,
  products: selectProductData,
  best: selectBestData,
});

export default connect(mapStateToProps)(Home);
