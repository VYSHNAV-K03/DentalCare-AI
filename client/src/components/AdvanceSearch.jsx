import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Container, Row, Col, Button } from "react-bootstrap";

const AdvanceSearch = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [location, setLocation] = useState("");
  const [guests, setGuests] = useState("");

  // Handle Location selection
  const selectedLocation = (value) => {
    setLocation(value);
    console.log("Location:", value);
  };

  // Handle Guests selection
  const selectedGuest = (value) => {
    setGuests(value);
    console.log("Guests:", value);
  };

  // Handle Search button click
  const handleSearch = () => {
    // You can perform any search logic here or API call
    console.log("Searching for:", { location, guests, startDate, endDate });
  };

  return (
    <section className="box-search-advance">
      <Container>
        <Row>
          <Col md={12} xs={12}>
            <div className="box-search shadow-sm">
              <div className="item-search">
                {/* Location Dropdown */}
                <CustomDropdown
                  label="Location"
                  onSelect={selectedLocation}
                  options={["USA, Turkish", "Tokyo, Japan", "Sydney, Australia", "Melbourne, Australia", "Paris, France"]}
                />
              </div>

              <div className="item-search item-search-2">
                {/* Check-in Date Picker */}
                <label className="item-search-label">Check-in</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd, MMMM, yyyy"
                  className="react-datepicker-wrapper"
                />
              </div>

              <div className="item-search item-search-2">
                {/* Check-out Date Picker */}
                <label className="item-search-label">Check-out</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd, MMMM, yyyy"
                  className="react-datepicker-wrapper"
                />
              </div>

              <div className="item-search bd-none">
                {/* Guests Dropdown */}
                <CustomDropdown
                  label="Guests"
                  onSelect={selectedGuest}
                  options={["2 adults, 1 child", "2 adults, 2 children", "2 adults, 3 children"]}
                />
              </div>

              <div className="item-search bd-none">
                {/* Search Button */}
                <Button onClick={handleSearch} className="primaryBtn d-flex justify-content-center">
                  <i className="bi bi-search me-2"></i> Search
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AdvanceSearch;
