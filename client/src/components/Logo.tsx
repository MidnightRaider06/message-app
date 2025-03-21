interface LogoProps {
  size?: number;
}

const Logo = ({ size = 5 }: LogoProps): JSX.Element => {
  return (
    <div className="logo-container">
      <img
        src="logo.png"
        alt="Thischord Logo"
        style={{
          width: `${size}rem`,
          height: `${size}rem`,
        }}
      />
    </div>
  );
};

export default Logo;
