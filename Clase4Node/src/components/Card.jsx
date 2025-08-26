const Card = ({ userName, onProfileClick, children }) => {
  return (
    <div className="card">
      <img
        src={`https://unavatar.io/${userName}`}
        alt={`${userName}'s avatar`}
        className="card-image"
      />
      <div className="card-content">
        {children}
        <button onClick={onProfileClick} className="profile-button">
          Ir a perfil
        </button>
      </div>
    </div>
  );
};

export default Card;
