import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes, { node } from 'prop-types';
import styled from 'styled-components';

const StyledMenu = styled.div`
  display: flex;
  flex-direction: column;
  height: 445px;
  position: absolute;
  width: 16.5rem;
  a {
    color: black;
    display: block;
    text-decoration: none;
  }
  button {
    width: 100%;
  }
`;

const StyledMenuContainer = styled.div`
  background-color: 'white';
  border-radius: 2px;
  box-shadow: 0 12px 17px 2px rgba(0, 0, 0, 0.14),
    0 5px 22px 4px rgba(0, 0, 0, 0.12), 0 7px 8px -4px rgba(0, 0, 0, 0.2);
  display: ${(props) => (props.isOpen ? 'none' : 'block')};
`;

const StyledListEntry = styled.a`
  padding: 0.5rem 0.5rem 0.5rem 1rem;

  :hover,
  :focus,
  &[aria-selected='true'] {
    background-color: yellow;
    color: black;
    font-weight: 800;
    outline: none;
  }
  :first-child {
    margin-top: 0.5rem;
  }
`;

const KEY_CODES = Object.freeze({
  RETURN: 13,
  ESC: 27,
  SPACE: 32,
  END: 35,
  HOME: 36,
  UP: 38,
  DOWN: 40,
});

const ReactMenu = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isContainerFocused, setIsContainerFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(1);
  const menuContainerRef = useRef(null);
  const menuButtonRef = useRef(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
    focusMenu();
  }, []);

  useEffect(() => {
    // as long as the menu is open, focus the next available item
    if (isOpen) {
      const nodes = menuContainerRef.current.childNodes;
      if (highlightedIndex >= 0 && highlightedIndex < node.length) {
        nodes[highlightedIndex].focus();
      }
    } else {
      // if the menu is closed, focus the button.
      menuButtonRef.current.focus();
    }
  }, [isOpen, highlightedIndex]);

  useEffect(() => {
    // when the focus is not within the menu button nor the menu container,
    // close the menu.
    if (!isFocused && !isContainerFocused) {
      closeMenu();
    }
  }, [isFocused, isContainerFocused, closeMenu]);

  const itemsCount = menuItems.length - 1;

  // utility functions
  const focusFirstItem = () => setHighlightedIndex(0);
  const focusLastItem = () => setHighlightedIndex(itemsCount);
  const focusNextItem = () => {
    if (highlightedIndex === itemsCount) {
      focusFirstItem();
    } else {
      setHighlightedIndex(highlightedIndex + 1);
    }
  };
  const focusPrevItem = () => {
    if (highlightedIndex === 0) {
      focusLastItem();
    } else {
      setHighlightedIndex(highlightedIndex - 1);
    }
  };

  const focusMenu = () => menuButtonRef?.current.focus();

  const openMenu = () => {
    setIsOpen(true);
    setIsFocused(true);
    focusFirstItem();
  };

  // Button Event handlers
  const buttonHandleClick = (event) => {
    event.preventDefault();
    isOpen ? closeMenu() : openMenu();
  };

  const buttonHandleKeyEvents = (event) => {
    event.preventDefault();
    switch (event.keyCode) {
      case KEY_CODES.SPACE:
      case KEY_CODES.RETURN:
      case KEY_CODES.DOWN:
        openMenu();
        break;
      case KEY_CODES.UP:
        openMenu();
        break;
      default:
        closeMenu();
        break;
    }
  };

  // Menu event handlers
  const menuHandleKeyEvents = (event) => {
    event.preventDefault();
    event.stopPropagation();
    switch (event.keyCode) {
      case KEY_CODES.SPACE:
      case KEY_CODES.DOWN:
        focusNextItem();
        break;
      case KEY_CODES.UP:
        focusPrevItem();
        break;
      case KEY_CODES.ESC:
        closeMenu();
        break;
      default:
        break;
    }
  };

  const menuItemsHandleKeyEvents = (event) => {
    if (
      event.keyCode === KEY_CODES.SPACE ||
      event.keyCode === KEY_CODES.RETURN
    ) {
      // for items we just need to stop event propagation or the menu container
      // will handle these event(which we don't want)
      event.stopPropagation();
      return;
    }
  };

  if (!Array.isArray(menuItems) || menuItems.length < 1) {
    console.error(
      'Please provide a menuItems array to render within menu component.'
    );
    return (
      <StyledMenu>
        <button>Empty Menu</button>
      </StyledMenu>
    );
  }
  return (
    <StyledMenu>
      <button
        id="menubutton"
        aria-haspopup="true"
        aria-controls="menu2"
        aria-expanded={isOpen}
        type="button"
        onClick={buttonHandleClick}
        onKeyDown={buttonHandleKeyEvents}
        ref={menuButtonRef}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
      >
        React Accessible Menu
      </button>
      <StyledMenuContainer
        id="menu2"
        aria-labelledby="menubutton"
        ref={menuContainerRef}
        role="menu"
        onKeyDown={menuHandleKeyEvents}
      >
        {isOpen &&
          menuItems.map((item) => (
            <StyledListEntry
              tabIndex="-1"
              onFocus={() => setIsContainerFocused(true)}
              onBlur={() => setIsContainerFocused(false)}
              key={item.id}
              onKeyDown={menuItemsHandleKeyEvents}
              role="menuitem"
              href="https://google.com/"
            >
              {item.name}
            </StyledListEntry>
          ))}
      </StyledMenuContainer>
    </StyledMenu>
  );
};

ReactMenu.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default ReactMenu;
