import React, { useEffect, useRef, useState } from 'react';
import BtnFilter from '../buttons/BtnFilter';
import { useLocation, useNavigate } from 'react-router-dom';
import BtnAction from '../buttons/BtnAction';

const Filter = ({ filterHeading, filterCategories, baseUrl, setFilterCategories, loaderIsActive=false }) => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({});
    const [filterActive, setFilterActive] = useState(false);
    const filterRef = useRef(null);
    const [filterHeight, setFilterHeight] = useState(0);

    const navigateFilter = (filterType, filterName) => {
        setFilters(prevFilters => {
            return { ...prevFilters, [filterType]: filterName };
        });
    }

    useEffect(() => {
        if (Object.keys(filters).length > 0) {
            const searchParams = new URLSearchParams();
            for (const [key, value] of Object.entries(filters)) {
                searchParams.append(key, value);
            }
            const newUrl = baseUrl + "/filter?" + searchParams.toString();
            navigate(newUrl);
        }
    }, [filters]);

    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const updatedFilterCategories = filterCategories.map(category => {
            const updatedFilters = category.filters.map(filter => {
                if (searchParams.get(category.url) === filter.url) {
                    return { ...filter, active: true };
                } else {
                    return { ...filter, active: false };
                }
            });

            return { ...category, filters: updatedFilters };
        });

        setFilterCategories(updatedFilterCategories);
    }, [location]);

    useEffect(() => {
        if (filterRef.current) {
            setFilterHeight(filterRef.current.scrollHeight);
        }
    }, [filterActive, filterCategories]);

    return (
        <div className="filter" style={loaderIsActive ? { opacity: "0.08", filter: "blur(1rem)" } : {}}>
            <div className='d-flex align-items-center'>
                <div className="filter-heading">{filterHeading}</div>
                <BtnAction style={{ scale: "0.9", marginBottom: "1rem", marginLeft: "auto" }} onClick={() => setFilterActive(prev => !prev)}>{filterActive ? "Hide" : "Show"}</BtnAction>
            </div>
            <div 
                className={`filter-types row ${filterActive ? 'active' : ''}`} 
                style={{ maxHeight: filterActive ? `${filterHeight + 40}px` : '0' }}
                ref={filterRef}
            >
                {filterCategories.map((category, index) => (
                    <div className="col-md-6" key={index}>
                        <div className="filter-section">
                            <p>{category.title}</p>
                            <div className="filter-categories">
                                {category.filters.map((filter, filterIndex) => (
                                    <BtnFilter key={filterIndex} className={filter.active ? 'btn-pill active' : 'btn-pill'} onClick={() => {
                                        navigateFilter(category.url, filter.url)
                                    }}>
                                        {filter.name}
                                    </BtnFilter>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Filter;
