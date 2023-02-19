import { useState, useEffect, useCallback } from 'react';

import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';

import LargeImage from './LargeImage/LargeImage';

import Button from './Button/Button';
import Modal from './Modal/Modal';
import Loader from './Loader/Loader';

import { imageFinder } from 'services/image-finder-api';

import styles from './app.module.scss';

const App = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [largeImage, setLargeImage] = useState(null);
  const [showGalleryItem, setShowGalleryItem] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!search) {
      return;
    }
    const fetchResults = async () => {
      try {
        setLoading(true);

        const { hits, totalHits } = await imageFinder(search, page);

        setResults(prevResults => [...prevResults, ...hits]);
        setTotal(totalHits);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [search, page]);

  const searchResults = useCallback(({ search }) => {
    setSearch(search);
    setResults([]);
    setPage(1);
    setShowGalleryItem(true);
  }, []);

  const showImage = useCallback(({ largeImageURL }) => {
    setShowModal(true);
    setLargeImage({ largeImageURL });
  }, []);

  const loadMore = useCallback(() => {
    setPage(prevPage => prevPage + 1);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setLargeImage(null);
  }, []);

  const totalPage = Math.ceil(total / 12);

  return (
    <>
      <Searchbar onSubmit={searchResults} />

      {showGalleryItem && (
        <ImageGallery results={results} showImage={showImage} />
      )}

      {error && <p className={styles.errorMessage}>{error}</p>}
      {loading && <Loader />}
      {Boolean(results.length) && page < totalPage && (
        <Button
          onClick={() => {
            loadMore();
          }}
          text="Load More"
        >
          Load More
        </Button>
      )}

      {showModal && (
        <Modal close={closeModal}>
          <LargeImage {...largeImage} />
        </Modal>
      )}
    </>
  );
};

export default App;

// class App extends Component {
//   state = {
//     search: '',
//     results: [],
//     loading: false,
//     error: null,
//     page: 1,
//     showModal: false,
//     largeImage: null,
//     showGalleryItem: false,
//     total: 0,
//   };

//   componentDidUpdate(prevProps, prevState) {
//     const { search, page } = this.state;
//     if (prevState.search !== search || prevState.page !== page) {
//       this.fetchResults();
//     }
//   }
//   async fetchResults() {
//     try {
//       this.setState({ loading: true });

//       const { search, page } = this.state;
//       const { hits, totalHits } = await imageFinder(search, page);
//       this.setState(({ results }) => ({
//         results: [...results, ...hits],
//         total: totalHits,
//       }));
//     } catch (error) {
//       this.setState({ error: error.message });
//     } finally {
//       this.setState({ loading: false });
//     }
//   }

//   searchResults = ({ search }) => {
//     this.setState({ search, results: [], page: 1, showGalleryItem: true });
//   };

//   loadMore = () => {
//     this.setState(({ page }) => ({ page: page + 1 }));
//   };

//   showImage = ({ largeImageURL }) => {
//     this.setState({
//       largeImage: {
//         largeImageURL,
//       },

//       showModal: true,
//     });
//   };

//   closeModal = () => {
//     this.setState({
//       showModal: false,
//       largeImage: null,
//     });
//   };

//   render() {
//     const {
//       results,
//       loading,
//       error,
//       showModal,
//       largeImage,
//       showGalleryItem,
//       total,
//       page,
//     } = this.state;
//     const { searchResults, loadMore, showImage, closeModal } = this;
//     const totalPage = Math.ceil(total / 12);

//     return (
//       <>
//         <Searchbar onSubmit={searchResults} />
//         {showGalleryItem && (
//           <ImageGallery results={results} showImage={showImage} />
//         )}

//         {error && <p className={styles.errorMessage}>{error}</p>}
//         {loading && <Loader />}
//         {Boolean(results.length) && page < totalPage && (
//           <Button
//             onClick={() => {
//               loadMore();
//             }}
//             text="Load More"
//           >
//             Load More
//           </Button>
//         )}

//         {showModal && (
//           <Modal close={closeModal}>
//             <LargeImage {...largeImage} />
//           </Modal>
//         )}
//       </>
//     );
//   }
// }
