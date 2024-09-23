const InfoBox = ({ title, links }) => (
  <div className="w-1/4 bg-[#E1D7B7] rounded-lg p-4">
    <h3 className="text-lg font-bold">{title}</h3>
    <ul className="mt-2">
      {links.map((link, index) => (
        <li key={index}>
          <a href="#" className="text-black hover:underline">{link}</a>
        </li>
      ))}
    </ul>
  </div>
);
