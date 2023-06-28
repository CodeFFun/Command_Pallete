//just a buch of imports only first line has the library functionality all others are icons used on app
import { useState, useEffect, useRef } from 'react'
import { HiOutlineBackspace } from 'react-icons/hi'
import { GrSort, GrSearch } from 'react-icons/gr'
import { BsArrowDownSquare, BsArrowUpSquare } from 'react-icons/bs'
import { AiOutlineEnter } from 'react-icons/ai'

function CommandPallete() {
  // State that stores input from our inputs field of command pallete
  const [inputs, setInputs] = useState({
    search: '',
    category: '',
    price: '',
  })
  //state that stores fetched api data
  const [api, setApi] = useState([])
  //it takes the index from the filteredResults. Set to -1 not to highlight any listItem until "arrowdown" or "arrowup" keybind is used
  const [focusIndex, setFocusIndex] = useState(-1)
  //takes the filtered result as ref for keybinds
  const resultContainer = useRef(null)
  //state to trigger the list items. To show or not
  const [showList, setShowList] = useState(false)
  //state to trigger to whether show category and price input section
  const [showInputs, setShowInputs] = useState(false)
  //state that takes filtered results after being filtered using inputs from user.
  const [filterResults, setFilterResults] = useState([])

  useEffect(() => {
    //fetching api from IFFE in order to not call and make it simple and to avoid typos bugs
    ;(async () => {
      const res = await fetch('https://fakestoreapi.com/products')
      const data = await res.json()
      setApi(data)
    })()

    //if not highlighted any list items using keybinds than return null
    if (!resultContainer.current) return
    //if shown than focus into that listItem or highlight that list item
    resultContainer.current.scrollIntoView({
      block: 'center',
    })
    //if all inputs are empty than fetched items will not be shown
    if (inputs.search === '' && inputs.category === '' && inputs.price === '') {
      setShowList(false)
    }
  }, [focusIndex, setShowList, inputs.search, inputs.category, inputs.price]) //all the dependency that will trigger useEffect

  //function onchange that helps to store value from input field to states and to filter fetched data from it
  const onChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value })) //stores inputs data
    setShowList(true) // triggers the showlist state that trriggers and shows results/filter results
    //function to filter the fetched data
    const filteredItems = api.filter((item) => {
      //returns the item that match the below condition
      return (
        item.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.category === e.target.value ||
        item.price < e.target.value
      )
    })
    setFilterResults(filteredItems) //set the state that holds filtered results
  }
  //it is for return functionality but didnt know what to do after the enter so it just triggers and resets the states
  const handleSelection = (selectedIndex) => {
    const selectedItem = api[selectedIndex]
    if (!selectedItem) return resetSearchComplete()
    resetSearchComplete()
  }

  //reset the states
  const resetSearchComplete = () => {
    setFocusIndex(-1)
    setShowList(false)
    setInputs({
      search: '',
      category: '',
      price: '',
    })
  }

  //the keydown functions

  const handleKeyDown = (e) => {
    let nextIndexCount = 0

    if (e.key === 'ArrowDown') {
      nextIndexCount = (focusIndex + 1) % api.length
    }
    if (e.key === 'ArrowUp') {
      nextIndexCount = (focusIndex - 1) % api.length
    }
    if (e.key === 'Enter') {
      handleSelection(focusIndex)
    }
    setFocusIndex(nextIndexCount)
  }
  return (
    <>
      {/* container that holds the command pallete */}
      <div
        className='command_pallete_container'
        tabIndex={1}
        onKeyDown={handleKeyDown}
      >
        <div className='command_pallete_inputs'>
          {/* below div holds icons and inputs  */}
          <div className='command_pallete'>
            {/* search icon */}
            <label htmlFor='input'>
              <GrSearch />
            </label>
            {/* input that takes in search/title */}
            <input
              type='text'
              name='search'
              id='input'
              placeholder='Search'
              value={inputs.search}
              onChange={onChange}
            />
            {/* holds the additional icons */}
            <div className='additional-property'>
              {/* below btn shows or hides category and price input */}
              <button>
                <GrSort onClick={() => setShowInputs(!showInputs)} />
              </button>
              {/* below btn doesnt do anything just to complete the design */}
              <button>
                <HiOutlineBackspace />
              </button>
            </div>
          </div>
          {/* below div holds the category and price input and triggers with function to show or hide the div */}
          <div
            className='command_pallete_extras'
            style={{ display: showInputs ? 'flex' : 'none' }}
          >
            <select
              name='category'
              id='category'
              onChange={onChange}
              value={inputs.category}
            >
              <option value='electronics'>electronics</option>
              <option value='jewelery'>jewelery</option>
              <option value="men's clothing">men's clothing</option>
              <option value="women's clothing">women's clothing</option>
            </select>
            <input
              type='number'
              name='price'
              placeholder='Price'
              value={inputs.price}
              onChange={onChange}
            />
          </div>
        </div>
        {/* holds the filtered results and triggers from function not be shown until input is written */}
        <div
          className='command_pallete_filter_container'
          style={{ display: showList ? 'block' : 'none' }}
        >
          {/* list to hold the filtered items */}
          <ul>
            {filterResults.map((item, index) => {
              return (
                <li
                  key={index}
                  ref={index === focusIndex ? resultContainer : null}
                  style={{
                    backgroundColor:
                      index === focusIndex ? 'rgba(0,0,0,0.1)' : ' ',
                    // above style is for keybinds. if highlighted or selected then the list items will have shadow background
                  }}
                >
                  {item.title}
                </li>
              )
            })}
          </ul>
        </div>
        {/* below div has the instructions of commands for command pallete */}
        <div className='command_pallete_instructions'>
          <span>
            <BsArrowDownSquare /> <BsArrowUpSquare /> to navigate{' '}
            <AiOutlineEnter /> to select 'esc' to cancel
          </span>
        </div>
      </div>
    </>
  )
}

export default CommandPallete
