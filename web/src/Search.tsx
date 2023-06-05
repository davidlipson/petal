import React from "react";
import debounce from "lodash.debounce";
import axios from "axios";

export interface SearchProps {
  submitSearch: (start: string, end: string) => void;
}

export interface SearchState {
  start_query: string;
  end_query: string;
  mode: string | null;
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
      mode: null,
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

  render(): React.ReactNode {
    const suggestions =
      this.state.focus === "start"
        ? this.state.start_suggestions
        : this.state.end_suggestions;
    return (
      <div id="search-bar">
        <input
          onChange={this.handleStartChange}
          value={this.state.start_query}
          type="text"
          placeholder="Start Address"
          onClick={() => this.setState({ focus: "start" })}
        />
        <input
          onChange={this.handleEndChange}
          value={this.state.end_query}
          type="text"
          placeholder="End Address"
          onClick={() => this.setState({ focus: "end" })}
        />
        {this.state.focus !== null && (
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
        )}
        <button id="search-button"
          onClick={() =>
            this.props.submitSearch(
              this.state.start_query,
              this.state.end_query
            )
          }
        >
          search
        </button>
      </div>
    );
  }
}
