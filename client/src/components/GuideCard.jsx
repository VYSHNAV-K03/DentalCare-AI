// src/components/GuideCard.jsx
import { Link } from 'react-router-dom';

const GuideCard = ({ guide }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{guide.name}</h5>
        <p className="card-text">Expertise: {guide.expertise}</p>
        <p className="card-text">Location: {guide.location}</p>
        <Link to={`/guide/${guide.id}`} className="btn btn-primary">View Profile</Link>
      </div>
    </div>
  );
};

export default GuideCard;
