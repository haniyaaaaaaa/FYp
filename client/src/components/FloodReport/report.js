import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import NavbarNormalvictim from '../NavbarNormalvictim';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const FloodReport = () => {
    const [floodReports, setFloodReports] = useState([]);
    const containerRef = useRef(null);

    useEffect(() => {
        fetchFloodReports();
    }, []);

    const fetchFloodReports = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/flood-report');
            setFloodReports(response.data);
        } catch (error) {
            console.error('Error fetching flood reports:', error);
        }
    };

    const handleScroll = (direction) => {
        const cardWidth = containerRef.current.firstChild.offsetWidth + 55; 
        const scrollOffset = direction === 'left' ? -cardWidth : cardWidth;
        containerRef.current.scrollLeft += scrollOffset;
    };

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh', 
            backgroundImage: `url(./flood.jpg)`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            <NavbarNormalvictim />
            <div style={{
                background: 'linear-gradient(to right, #000000, rgba(59, 177, 155, 1))',
                color: 'white',
                padding: '60px 88px',
                height: '31vh',
            }}>
                <h1 style={{ color: 'rgba(59, 177, 155, 1)', marginLeft: '30px', marginTop: '10px', fontSize: '55px' }}>Flood Reports</h1>
                <div style={{ marginLeft: '30px', marginTop: '20px' }}>
                    <p style={{ fontSize: '20px' }}>
                        Here is some historical data to better comprehend flood trends.
                    </p>
                </div>
            </div>
            <div style={{ position: 'relative', padding: '20px 88px', fontFamily: 'Arial, sans-serif' }}>
                <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                    <button onClick={() => handleScroll('left')} style={{ marginRight: '10px', background: 'none', border: 'none' }}>
                        <FontAwesomeIcon icon={faChevronLeft} style={{ fontSize: '24px', color: 'white' }} />
                    </button>
                    <div ref={containerRef} style={{ display: 'flex', overflowX: 'auto', scrollBehavior: 'smooth', overflow: 'hidden' }}>
                        {floodReports.map((report, index) => (
                            <div key={index} style={{ minWidth: '350px', margin: '0 39px', height: '300px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s', cursor: 'pointer', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                                <div style={{ padding: '20px', boxSizing: 'border-box', height: '100%' }}>
                                    <strong>Year:</strong> {report.year}<br />
                                    <strong>Month:</strong> {report.month}<br />
                                    <strong>Date:</strong> {report.date}<br />
                                    <strong>Location:</strong> {report.location}<br />
                                    <strong>Cause:</strong> {report.cause}<br />
                                    <strong>Deaths:</strong> {report.deaths}<br />
                                    <strong>Property Damage:</strong> {report.propertyDamages}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => handleScroll('right')} style={{ marginLeft: '10px', background: 'none', border: 'none' }}>
                        <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '24px', color: 'white' }} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FloodReport;
