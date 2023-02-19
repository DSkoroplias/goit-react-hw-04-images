import { useState, memo, useCallback } from 'react';

import PropTypes from 'prop-types';

import { ReactComponent as AddIcon } from '../../icons/search.svg';

import initialState from './initialState';

import styles from './searchbar.module.scss';

const Searchbar = ({ onSubmit }) => {
  const [state, setState] = useState({ ...initialState });

  const handleChange = useCallback(({ target }) => {
    const { name, value } = target;
    setState(prevState => {
      return { ...prevState, [name]: value };
    });
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({ ...state });
    setState({ ...initialState });
  };

  const { search } = state;

  return (
    <header className={styles.searchbar}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <button type="submit" className={styles.button}>
          <AddIcon width="20" height="20" />
          <span className={styles.button_label}>Search</span>
        </button>

        <input
          value={search}
          onChange={handleChange}
          name="search"
          className={styles.input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          required
        />
      </form>
    </header>
  );
};

export default memo(Searchbar);

Searchbar.protoTypes = {
  onSubmit: PropTypes.func.isRequired,
};
