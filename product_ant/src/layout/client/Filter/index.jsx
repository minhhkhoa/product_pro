import { Input } from 'antd';
const { Search } = Input;
import SelectCategory from "../../../components/client/SelectCategory";
import "./style.css";

function Filter() {

  const onSearch = (value) => {
    if(value){
      console.log("search: ", value);
    }
  }

  return (
    <>
      <div className='container-filter'>
        <div>
          <Search
            className='search'
            placeholder="input search text"
            onSearch={onSearch}
            style={{
              width: 200,
            }}
          />

        </div>
        <div className="select-category">
          <SelectCategory />
        </div>
      </div>
    </>
  )
}

export default Filter;