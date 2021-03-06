import React from 'react';
import axios from 'axios';
import Search from './Search.jsx';
import OverallRating from './OverallRating.jsx';
import RatingsTable from './RatingsTable.jsx';
import ReviewsList from './ReviewsList.jsx';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const SpecsContainer = styled.div`
  max-width: 648px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const Head = styled.div`
  display: flex;
  justify-content: left;
  font-family:Circular, -apple-system, system-ui, Roboto, "Helvetica Neue", sans-serif;
  color: #484848;
  font-size: 24px;
  font-weight: 648;
  padding-top: 2px;
  padding-bottom: 16px;
`;

const RatingsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const ReviewsListContainer = styled.div`
  max-width: 648px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding-top: 24px;
`;

const SearchResults = styled.div`
  max-width: 648px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  padding-top: 24px;
`;

const SearchResultText = styled.div`

`;

const ClearSearchResults = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SearchValue = styled.div`

`;

const Button = styled.button`
  border: none;
  border-color: transparent;
  background-color: transparent;
  cursor: pointer;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      filteredReviews: [],
      numReviews: 0,
      avgCommunication: 0,
      avgAccuracy: 0,
      avgLocation: 0,
      avgCheckIn: 0,
      avgCleanliness: 0,
      avgValue: 0,
      totalAvgRating: 0,
      search: ''
    };

    this.getAllReviews = this.getAllReviews.bind(this);
    this.searchValue = this.searchValue.bind(this);
  }

  componentDidMount() {
    this.getAllReviews();
  }

  getAllReviews() {
    axios.get('/reviews')
      .then(result => {
        var reviews = result.data;
        var random = (min, max) => {
          min = Math.ceil(min);
          max = Math.floor(max);
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        var numReviews = random(25, 100);
        reviews = reviews.slice(0, numReviews);

        const checkIn = reviews.map(review => review.ratings.checkIn);
        const communication = reviews.map(review => review.ratings.communication);
        const location = reviews.map(review => review.ratings.location);
        const accuracy = reviews.map(review => review.ratings.accuracy);
        const cleanliness = reviews.map(review => review.ratings.cleanliness);
        const value = reviews.map(review => review.ratings.value);

        const totalCheckIn = checkIn.reduce((acc, cur) => acc + cur, 0);
        const totalCommunication = communication.reduce((acc, cur) => acc + cur, 0);
        const totalLocation = location.reduce((acc, cur) => acc + cur, 0);
        const totalAccuracy = accuracy.reduce((acc, cur) => acc + cur, 0);
        const totalCleanliness = cleanliness.reduce((acc, cur) => acc + cur, 0);
        const totalValue = value.reduce((acc, cur) => acc + cur, 0);
        const totalAvgRating = Number.parseFloat((totalCheckIn + totalCommunication + totalLocation + totalAccuracy + totalCleanliness + totalValue) / (numReviews * 6)).toFixed(2);
        const avgCategoryRating = (num) => Number.parseFloat(num / numReviews).toFixed(1);

        this.setState({
          reviews: result.data,
          numReviews: numReviews,
          avgCommunication: avgCategoryRating(totalCommunication),
          avgAccuracy: avgCategoryRating(totalAccuracy),
          avgLocation: avgCategoryRating(totalLocation),
          avgCheckIn: avgCategoryRating(totalCheckIn),
          avgCleanliness: avgCategoryRating(totalCleanliness),
          avgValue: avgCategoryRating(totalValue),
          totalAvgRating: totalAvgRating,
        });
      })
      .catch(err => console.error(err));
  }

  searchValue(value) {
    let reviews = this.state.reviews.slice();
    var search = reviews.filter(review => review.comment.toLowerCase().includes(value.toLowerCase()));
    this.setState({ filteredReviews: search });
  }

  render() {
    var displayReviews = this.state.filteredReviews.length ? <ReviewsList reviews={this.state.filteredReviews} /> : <ReviewsList reviews={this.state.reviews} />;

    if (!this.state.reviews.length) {
      return (
        <div></div>
      );
    } else {
      return (
        <Wrapper>
          <div>
            <SpecsContainer>

              <Head>Reviews</Head>

              <RatingsContainer>
                <OverallRating totalAvgRating={this.state.totalAvgRating} numReviews={this.state.numReviews} />
              </RatingsContainer>
            </SpecsContainer>

            <RatingsTable ratings={this.state} />

            <SearchContainer>
              <Search searchValue={this.searchValue} />
            </SearchContainer>

            <ReviewsListContainer>
              {displayReviews}
            </ReviewsListContainer>
          </div>
        </Wrapper>
      );
    }
  }
}

export default App;