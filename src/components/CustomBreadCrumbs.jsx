import { Breadcrumb } from "antd";
import { useNavigate } from "react-router-dom";

const CustomBreadCrumbs = ({ items = [] }) => {
  const navigate = useNavigate();

  const handleClick = (path) => {
    navigate(path);
  };

  const itemRender = (route, params, routes, paths) => {
    const isLast = routes.indexOf(route) === routes.length - 1;

    return isLast ? (
      // Render the last item without a link
      <div className="text-orange-600 flex center gap-1">
        {route.icon} {route.title}
      </div>
    ) : (
      // Render the item with a link
      <div
        onClick={() => handleClick(route.path)}
        className="flex center gap-1 hover:text-black cursor-pointer"
      >
        <span className="font-extrabold">{route.icon}</span>
        {route.title}
      </div>
    );
  };

  return (
    <Breadcrumb
      className="w-fit h-full font-outfit flex center"
      separator="/"
      items={items}
      itemRender={itemRender}
    />
  );
};

export default CustomBreadCrumbs;
