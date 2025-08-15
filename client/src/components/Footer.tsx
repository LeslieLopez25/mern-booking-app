const Footer = () => {
  return (
    <div className="bg-blue-800 py-10">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 text-center sm:text-left">
        <span className="text-3xl text-white font-bold tracking-tight">
          MernHolidays.com
        </span>
        <span className="text-white font-bold tracking-tight flex flex-col sm:flex-row gap-2 sm:gap-4">
          <p className="cursor-pointer">Privacy Policy</p>
          <p className="cursor-pointer">Terms of Service</p>
        </span>
      </div>
    </div>
  );
};

export default Footer;
