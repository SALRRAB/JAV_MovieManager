// Must match EndpointHost in appsettings.json.
const API_BASE_URL = "http://localhost:8700";

export function getMovies() {
    return fetch(`${API_BASE_URL}/movies`, {
        method: "GET",
        mode: "cors"
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
};

export function getMostRecentMovies() {
    return fetch(`${API_BASE_URL}/movies/recent`, {
        method: "GET",
        mode: "cors"
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
};

export function getMovieYears() {
    return fetch(`${API_BASE_URL}/movies/years`, {
        method: "GET",
        mode: "cors"
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
};

export function getMoivesByFilter(filterType, filters, isAndOperator) {
    return fetch(`${API_BASE_URL}/movies/filters`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
            filterType: filterType,
            filters: filters,
            isAndOperator: isAndOperator
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function getMoviesWildcardSearch(searchString, searchString2, searchType) {
    return fetch(`${API_BASE_URL}/movies/wildcard`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
            searchString: searchString,
            searchString2: searchString2,
            searchType: searchType
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function getMoviesQuerySearch(searchString) {
    return fetch(`${API_BASE_URL}/movies/querySearch`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({ searchString: searchString }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function getLikedMovies() {
    return fetch(`${API_BASE_URL}/movies/like`, {
        method: "GET",
        mode: "cors"
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function getMovieDetails(movieViewModel) {
    return fetch(`${API_BASE_URL}/movies/details`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
            imdbId: movieViewModel?.imdbId,
            title: movieViewModel?.title,
            posterFileLocation: movieViewModel?.posterFileLocation,
            fanArtLocation: movieViewModel?.fanArtLocation,
            movieLocation: movieViewModel?.movieLocation,
            dateAdded: movieViewModel?.dateAdded,
            director: movieViewModel?.director ?? "",
            studio: movieViewModel?.studio ?? ""
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function likeMovie(searchString) {
    return fetch(`${API_BASE_URL}/movies/like/` + searchString, {
        method: "PUT",
        mode: "cors"
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function scanAndAddNewMovies(days) {
    return fetch(`${API_BASE_URL}/movies/addnew/` + days, {
        method: "PUT",
        mode: "cors",
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();;
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function deleteMovies() {
    return fetch(`${API_BASE_URL}/movies/delete/`, {
        method: "DELETE",
        mode: "cors",
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();;
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}


export function getAllActorNames() {
    return fetch(`${API_BASE_URL}/actors/names`, {
        method: "GET",
        mode: "cors",
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function getActorsByRanges(heightLower, heightUpper, cupLower, cupUpper, age) {
    return fetch(`${API_BASE_URL}/actors/ranges`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
            heightLower: heightLower,
            heightUpper: heightUpper,
            cupLower: cupLower,
            cupUpper: cupUpper,
            age: age
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function getActorByName(searchString) {
    return fetch(`${API_BASE_URL}/actors/` + searchString, {
        method: "GET",
        mode: "cors"
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function getActorByNames(names) {
    return fetch(`${API_BASE_URL}/actors/getbynames`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(names),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function getLikedActors() {
    return fetch(`${API_BASE_URL}/actors/like`, {
        method: "GET",
        mode: "cors"
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function getLocalActors() {
    return fetch(`${API_BASE_URL}/actors/local`, {
        method: "GET",
        mode: "cors"
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function likeActor(searchString) {
    return fetch(`${API_BASE_URL}/actors/like/` + searchString, {
        method: "PUT",
        mode: "cors"
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function getAllGenres() {
    return fetch(`${API_BASE_URL}/genres`, {
        method: "GET",
        mode: "cors",
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function getGenreByName(searchString) {
    return fetch(`${API_BASE_URL}/genres/` + searchString, {
        method: "GET",
        mode: "cors"
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function getAllGenreNames() {
    return fetch(`${API_BASE_URL}/genres/names`, {
        method: "GET",
        mode: "cors",
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function getLikedGenres() {
    return fetch(`${API_BASE_URL}/genres/like`, {
        method: "GET",
        mode: "cors"
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function likeGenre(searchString) {
    return fetch(`${API_BASE_URL}/genres/like/` + searchString, {
        method: "PUT",
        mode: "cors"
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function getAllTags() {
    return fetch(`${API_BASE_URL}/tags`, {
        method: "GET",
        mode: "cors",
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function getTagByName(searchString) {
    return fetch(`${API_BASE_URL}/tags/` + searchString, {
        method: "GET",
        mode: "cors"
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function getAllTagNames() {
    return fetch(`${API_BASE_URL}/tags/names`, {
        method: "GET",
        mode: "cors",
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function getLikedTags() {
    return fetch(`${API_BASE_URL}/tags/like`, {
        method: "GET",
        mode: "cors"
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function likeTag(searchString) {
    return fetch(`${API_BASE_URL}/tags/like/` + searchString, {
        method: "PUT",
        mode: "cors"
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function getAllDirectorNames() {
    return fetch(`${API_BASE_URL}/directors/names`, {
        method: "GET",
        mode: "cors",
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function getAllStudioNames() {
    return fetch(`${API_BASE_URL}/studio/names`, {
        method: "GET",
        mode: "cors",
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function createPotPlayerPlayList(movies, playListName) {
    return fetch(`${API_BASE_URL}/playlist/create/` + playListName, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(movies),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function createPotPlayerPlayListByActors(actors, playListName) {
    return fetch(`${API_BASE_URL}/playlist/createbyactors/` + playListName, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(actors),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function addToDefaultPotPlayerPlayList(movies) {
    return fetch(`${API_BASE_URL}/playlist/append/default`, {
        method: "PUT",
        mode: "cors",
        body: JSON.stringify(movies),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function getUserSettings() {
    return fetch(`${API_BASE_URL}/usersettings`, {
        method: "GET",
        mode: "cors",
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.json();
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function updateUserSettings(userSettings) {
    return fetch(`${API_BASE_URL}/usersettings/update`, {
        method: "PUT",
        mode: "cors",
        body: JSON.stringify(userSettings),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
    }).then(resp => {
        return resp;
    }).catch(error => {
        console.log(error);
    });
}

export function getImage(imageType, id) {
    // Image API returns binary JPEG data; convert to an object URL for <img> tags.
    return fetch(`${API_BASE_URL}/images/getimage`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
            imageType: imageType,
            id: id,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(resp => {
        if (!resp.ok) {
            throw resp;
        }
        return resp.blob();
    }).then(blob => {
        return URL.createObjectURL(blob);
    }).catch(error => {
        console.log(error);
    });
}