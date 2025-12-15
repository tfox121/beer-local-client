/**
 * AddressAutocomplete
 *
 * Free alternative to react-geosuggest using OpenStreetMap Nominatim API
 */

import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

const AddressAutocomplete = forwardRef(({
  label,
  id,
  location,
  radius = 1500,
  minlength = 3,
  country = 'gb',
  onSuggestSelect,
  onBlur,
  autoActivateFirstSuggest = false,
  required = false,
  initialValue = '',
  className = '',
}, ref) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceTimerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    selectSuggest: () => {
      if (suggestions.length > 0 && selectedIndex >= 0) {
        handleSelectSuggestion(suggestions[selectedIndex]);
      } else if (suggestions.length > 0) {
        handleSelectSuggestion(suggestions[0]);
      }
    },
    focus: () => {
      inputRef.current?.focus();
    },
  }));

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const searchNominatim = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < minlength) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        format: 'json',
        addressdetails: '1',
        limit: '5',
        countrycodes: country,
      });

      if (location && location.length === 2) {
        params.append('lat', location[0]);
        params.append('lon', location[1]);
        params.append('radius', radius);
      }

      const response = await fetch(`${NOMINATIM_BASE_URL}?${params.toString()}`, {
        headers: {
          'User-Agent': 'BeerLocal/1.0',
        },
      });

      if (!response.ok) {
        throw new Error('Nominatim API error');
      }

      const data = await response.json();
      const formattedSuggestions = data.map((item, index) => ({
        location: [parseFloat(item.lat), parseFloat(item.lon)],
        label: item.display_name,
        formatted_address: item.display_name,
        gmaps: {
          formatted_address: item.display_name,
        },
        raw: item,
        id: `${item.lat}-${item.lon}-${index}`,
      }));

      setSuggestions(formattedSuggestions);
      setShowSuggestions(true);
      setSelectedIndex(autoActivateFirstSuggest ? 0 : -1);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setQuery(value);
    setSelectedIndex(-1);

    // Debounce API calls
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      searchNominatim(value);
    }, 300);
  };

  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion.label);
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);

    if (onSuggestSelect) {
      onSuggestSelect(suggestion);
    }
  };

  const handleInputBlur = (e) => {
    // Delay to allow click on suggestion
    setTimeout(() => {
      setShowSuggestions(false);
      if (onBlur) {
        onBlur(e);
      }
    }, 200);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        handleSelectSuggestion(suggestions[selectedIndex]);
      } else if (suggestions.length > 0) {
        handleSelectSuggestion(suggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className={`geosuggest ${className}`} style={{ position: 'relative' }}>
      <Input
        ref={inputRef}
        id={id}
        label={label}
        value={query}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        required={required}
        loading={isLoading}
        placeholder="Start typing an address..."
        style={{ width: '100%' }}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul
          ref={suggestionsRef}
          className="geosuggest__suggests"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            margin: 0,
            padding: 0,
            listStyle: 'none',
            background: 'white',
            border: '1px solid #ccc',
            borderTop: 'none',
            maxHeight: '200px',
            overflowY: 'auto',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          {suggestions.map((suggestion, index) => {
            const { id: suggestionId, label: suggestionLabel } = suggestion;
            return (
              <li
                key={suggestionId}
                className={`geosuggest__item ${index === selectedIndex ? 'geosuggest__item--active' : ''}`}
                onClick={() => handleSelectSuggestion(suggestion)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectSuggestion(suggestion);
                  }
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                role="option"
                tabIndex={0}
                aria-selected={index === selectedIndex}
                style={{
                  padding: '10px',
                  cursor: 'pointer',
                  backgroundColor: index === selectedIndex ? '#f0f0f0' : 'white',
                }}
              >
                {suggestionLabel}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
});

AddressAutocomplete.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  location: PropTypes.arrayOf(PropTypes.number),
  radius: PropTypes.number,
  minlength: PropTypes.number,
  country: PropTypes.string,
  onSuggestSelect: PropTypes.func,
  onBlur: PropTypes.func,
  autoActivateFirstSuggest: PropTypes.bool,
  required: PropTypes.bool,
  initialValue: PropTypes.string,
  className: PropTypes.string,
};

AddressAutocomplete.displayName = 'AddressAutocomplete';

export default AddressAutocomplete;

