import React from "react";
import debounce from "lodash.debounce";
import axios from "axios";
import { Mode } from "./Mode";

export interface SearchProps {
  submitSearch: (start: string, end: string, mode: number) => void;
}

export interface SearchState {
  start_query: string;
  end_query: string;
  mode: number;
  start_suggestions: string[];
  end_suggestions: string[];
  focus: string | null;
}

export class Search extends React.Component<SearchProps, SearchState> {
  constructor(props: any) {
    super(props);
    this.state = {
      start_query: "",
      end_query: "",
      mode: 0,
      start_suggestions: [],
      end_suggestions: [],
      focus: null,
    };
    this.handleEndChange = this.handleEndChange.bind(this);
    this.handleStartChange = this.handleStartChange.bind(this);
    this.suggestions = debounce(this.suggestions, 1000);
  }

  suggestions(address: string, start = true): void {
    axios
      .get(`http://localhost:3000/addresses?address=${address}`)
      .then((response) => {
        const suggestions = response.data.map(
          (address: { name: string }) => address.name
        );
        if (start) {
          this.setState({ start_suggestions: suggestions });
        } else {
          this.setState({ end_suggestions: suggestions });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleStartChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.suggestions(event.target.value);
    this.setState({ start_query: event.target.value });
  }

  handleEndChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.suggestions(event.target.value, false);
    this.setState({ end_query: event.target.value });
  }

  swapAddresses = () => {
    const { start_query, end_query, start_suggestions, end_suggestions } =
      this.state;
    this.setState({
      start_query: end_query,
      end_query: start_query,
      start_suggestions: end_suggestions,
      end_suggestions: start_suggestions,
    });
  };

  render(): React.ReactNode {
    const suggestions =
      this.state.focus === "start"
        ? this.state.start_suggestions
        : this.state.end_suggestions;

    const suggestionsDiv = (
      <div id="suggestions">
        {suggestions.map((suggestion, i: number) => (
          <div key={`suggestion-${i}`}>
            <button
              className="suggestion-button"
              onClick={() => {
                if (this.state.focus === "start") {
                  this.setState({ start_query: suggestion, focus: null });
                } else {
                  this.setState({ end_query: suggestion, focus: null });
                }
              }}
            >
              {suggestion}
            </button>
          </div>
        ))}
      </div>
    );

    return (
      <div id="search-bar">
        <Mode
          currentMode={this.state.mode}
          setMode={(mode: number) => this.setState({ mode })}
        />
        <input
          id="start-add-input"
          onChange={this.handleStartChange}
          value={this.state.start_query}
          type="text"
          placeholder="Start Address"
          onClick={() => this.setState({ focus: "start" })}
        />
        {this.state.focus === "start" && suggestionsDiv}
        <div onClick={this.swapAddresses} id="swap-addresses">
          <div id="swap-icon-top"></div>
          <div id="swap-icon-bottom"></div>
        </div>
        <input
          id="end-add-input"
          onChange={this.handleEndChange}
          value={this.state.end_query}
          type="text"
          placeholder="End Address"
          onClick={() => this.setState({ focus: "end" })}
        />
        {this.state.focus === "end" && suggestionsDiv}
        <button
          id="search-button"
          onClick={() =>
            this.props.submitSearch(
              this.state.start_query,
              this.state.end_query,
              this.state.mode
            )
          }
        >
          Search
        </button>
      </div>
    );
  }
}
