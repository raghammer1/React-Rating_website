// import { useDispatch } from 'react-redux';
// import { useSelector } from 'react-redux';
// import { pageChange, pageChangeLink, setCart } from '../features/movieSlice';

// import { useEffect, useState } from 'react';
// import { useLocation, useNavigate, useParams } from 'react-router';
// import { Link } from 'react-router-dom';
// import MovieSearch from './MovieSearch';
// const MovieTiles = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const allStore = useSelector((store) => store.movies);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const params = useParams();
//   useEffect(() => {
//     let path = location.pathname;
//     if (params?.query && !path.includes('movie')) {
//       setSearchQuery(params.query);
//     } else {
//       setSearchQuery('');
//     }
//   }, [params]);
//   useEffect(() => {
//     if (params.pageNum) {
//       // dispatch(getCartItems(allStore.currentPage));
//       console.log(params);
//       fetch(`http://localhost:3000/home?page=${params.pageNum}`)
//         .then((response) => response.json())
//         .then((data) => {
//           dispatch(setCart({ allMovies: data }));
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//     }
//   }, [params.pageNum]);
//   useEffect(() => {
//     let [hi, home, pageNumLinks] = location.pathname.split('/');
//     pageNumLinks = parseInt(pageNumLinks);
//     dispatch(pageChangeLink({ pageNumLinks }));
//   }, [location]);
//   const paginationNums = [];
//   if (
//     allStore.currentPage < allStore.totalPages - 5 &&
//     allStore.currentPage >= 6
//   ) {
//     for (let i = allStore.currentPage - 5; i < allStore.currentPage + 6; i++) {
//       paginationNums.push(i);
//     }
//   } else if (allStore.currentPage > allStore.totalPages - 5) {
//     for (let i = allStore.totalPages - 10; i < allStore.totalPages + 1; i++) {
//       paginationNums.push(i);
//     }
//   } else if (allStore.currentPage < 6) {
//     for (let i = 1; i < 11; i++) {
//       paginationNums.push(i);
//     }
//   }
//   const allMovies = allStore.cartItems;
//   // if (allStore.isLoading === true) {
//   //   return <h1 className="h1">Loading...</h1>;
//   // }

//   if (searchQuery) {
//     return (
//       <>
//         <div>
//           <h1>Search results: "{searchQuery}"</h1>
//           <h4>Page: {allStore.currentPage}</h4>
//           <MovieSearch
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//           />
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <div>
//         <h1>All Movies</h1>
//         <h4>Page: {allStore.currentPage}</h4>

//         <MovieSearch
//           searchQuery={searchQuery}
//           setSearchQuery={setSearchQuery}
//         />

//         <ul className="grid-4--cols">
//           {allMovies.map((movie) => (
//             <li key={movie.id} className="grid-item">
//               <Link to={`/movie/${movie.id}`} key={movie.id}>
//                 <h3>{movie.title}</h3>
//               </Link>
//               <img
//                 src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
//                 alt={movie.title}
//               />
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div>
//         {paginationNums.map((p) => (
//           <button
//             href={'/home' + allStore.currentPage}
//             onClick={(e) => {
//               e.preventDefault;
//               navigate(`/home/${p}`, { replace: false });
//               console.log(p);
//               dispatch(pageChange({ p }));
//             }}
//             key={p}
//             className={allStore.currentPage === p ? 'active-btn' : null}
//           >
//             {p}
//           </button>
//         ))}
//       </div>
//     </>
//   );
// };

// export default MovieTiles;

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import MovieSearch from './MovieSearch';
import {
  pageChange,
  pageChangeLink,
  setCart,
  setLoadingFalse,
} from '../features/movieSlice';

const MovieTiles = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const allStore = useSelector((store) => store.movies);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    if (params?.query && !location.pathname.includes('movie')) {
      setSearchQuery(params.query);
    } else {
      setSearchQuery('');
    }
  }, [params, location]);

  useEffect(() => {
    dispatch(setLoadingFalse());
    if (params.pageNum) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/home?page=${params.pageNum}`
          );
          const data = await response.json();
          dispatch(setCart({ allMovies: data }));
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
    }
  }, [params.pageNum]);

  useEffect(() => {
    const [, , pageNumLinks] = location.pathname.split('/');
    const pageNum = parseInt(pageNumLinks);
    dispatch(pageChangeLink({ pageNumLinks: pageNum }));
  }, [location]);

  const paginationNums = [];
  if (
    allStore.currentPage < allStore.totalPages - 5 &&
    allStore.currentPage >= 6
  ) {
    for (let i = allStore.currentPage - 5; i < allStore.currentPage + 6; i++) {
      paginationNums.push(i);
    }
  } else if (allStore.currentPage > allStore.totalPages - 5) {
    for (let i = allStore.totalPages - 10; i < allStore.totalPages + 1; i++) {
      paginationNums.push(i);
    }
  } else if (allStore.currentPage < 6) {
    for (let i = 1; i < 11; i++) {
      paginationNums.push(i);
    }
  }

  const allMovies = allStore.cartItems;

  const handlePageChange = (page) => {
    navigate(`/home/${page}`, { replace: false });
    dispatch(pageChange({ p: page }));
  };

  if (allStore.isLoading) {
    return <h2>Loading...</h2>;
  }

  return searchQuery ? (
    <SearchMainPage
      searchQuery={searchQuery}
      allStore={allStore}
      setSearchQuery={setSearchQuery}
    />
  ) : (
    <MainPage
      allStore={allStore}
      searchQuery={searchQuery}
      paginationNums={paginationNums}
      setSearchQuery={setSearchQuery}
      allMovies={allMovies}
      dispatch={dispatch}
      navigate={navigate}
    />
  );
};

export default MovieTiles;

const SearchMainPage = (props) => {
  const { searchQuery, allStore, setSearchQuery } = props;
  return (
    <>
      <div>
        <h1>Search results: "{searchQuery}"</h1>
        <h4>Page: {allStore.currentPage}</h4>
        <MovieSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
    </>
  );
};

const MainPage = (props) => {
  const {
    allStore,
    searchQuery,
    paginationNums,
    setSearchQuery,
    allMovies,
    dispatch,
    navigate,
  } = props;
  return (
    <>
      <div>
        <h1>All Movies</h1>
        <h4>Page: {allStore.currentPage}</h4>

        <MovieSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <ul className="grid-4--cols">
          {allMovies.map((movie) => (
            <li key={movie.id} className="grid-item">
              <Link to={`/movie/${movie.id}`} key={movie.id}>
                <h3>{movie.title}</h3>
              </Link>
              <img
                src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                alt={movie.title}
              />
            </li>
          ))}
        </ul>
      </div>
      <div>
        {paginationNums.map((p) => (
          <button
            href={'/home' + allStore.currentPage}
            onClick={(e) => {
              e.preventDefault;
              navigate(`/home/${p}`, { replace: false });
              console.log(p);
              dispatch(pageChange({ p }));
            }}
            key={p}
            className={allStore.currentPage === p ? 'active-btn' : null}
          >
            {p}
          </button>
        ))}
      </div>
    </>
  );
};
