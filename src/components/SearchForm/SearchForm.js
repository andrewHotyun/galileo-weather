import cn from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import * as Api from '../../api/api';
import CountriesSelect from '../CountriesSelect';
import styles from './SearchForm.module.scss';
import * as msg from './messages';

class SearchForm extends React.Component {
    state = {
        countries: Api.getCountries().map(country => ({
            label: country.name,
            value: country.alpha2,
        })),
        country: null,
        city: '',
        error: '',
        msg: msg.fillForm,
    };

    handleCountry = country => {
        // country selection was cleared
        if (country) {
            this.setState({ country, error: '', msg: msg.enterCityNow });
        } else {
            this.setState({ country, city: '', msg: msg.selectCountry });
        }
    };

    handleCity = e => this.setState({ city: e.target.value });

    handleSearchSubmit = e => {
        e.preventDefault();
        const { country, city } = this.state;
        if (!country) {
            return this.setState({ error: msg.selectCountry });
        }
        if (!city) {
            return this.setState({ error: msg.enterCity });
        }

        this.setState({ error: '', msg: msg.searchInProgress });
        this.props
            .onSubmit(country, city)
            .then(() => this.setState({ msg: msg.searchCompleted }), err => this.setState({ error: err.message }));
        };
    

    renderMsg = () => {
        const { error, msg } = this.state;
        if (error) {
            return <p className={cn(styles.msg, styles.err)}>{error}</p>;
        }
        if (msg) {
            return <p className={styles.msg}>{msg}</p>;
        }

        return null;
    };

    render() {
        const { countries, country, city } = this.state;

        return (
            <div className={styles.container}>
                {this.renderMsg()}
                <form onSubmit={this.handleSearchSubmit} className={styles.form}>
                    <CountriesSelect onSelect={this.handleCountry} items={countries} className={styles.formItem} />
                    <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={this.handleCity}
                        disabled={!country}
                        className={styles.formItem}
                    />
                    <input type="submit" value="Get Weather!" className={styles.formItem} />
                </form>
            </div>
        );
    }
}

SearchForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

export default SearchForm;
