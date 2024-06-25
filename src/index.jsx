import { render } from "solid-js/web";
import "./index.scss";
import data from "../extensions.json";
import metadata from "../metadata.json";
import { Router, Route, useParams, A } from "@solidjs/router";
import { FaSolidUsers, FaBrandsGithub, FaSolidDownload } from 'solid-icons/fa'

const extensions = [
    ...new Map(data.extensions.map((ext) => [ext.id, ext])).values(),
];
extensions.forEach((ext) => {
    const meta = metadata.find((m) => m.id === ext.id);
    if (meta) {
        Object.assign(ext, meta);
    }
});

const Details = () => {
    const params = useParams();
    const extensions = [
        ...new Map(data.extensions.map((ext) => [ext.id, ext])).values(),
    ];
    const ext = extensions.find((ext) => ext.id === params.name);
    return (
        <div>
            <h1>{ext.id}</h1>
            <p>{ext.short_description}</p>
        </div>
    );
};

const Home = () => {
    return (
        <div id="extension-list">
            <For each={extensions}>
                {(ext) => (
                    <div class="extension">
                        <div class="ext-image">
                            <A href={ext.id}>
                                <img src={ext.icon} alt={ext.id} />
                            </A>
                        </div>
                        <div class="ext-desc">
                            <h2>
                                <A href={ext.id}>{ext.name}</A>
                                <span class="min-version">
                                    {ext.min_lnbits_version || "0.0.0"}
                                </span>
                                <span class="version">{ext.version}</span>
                            </h2>
                            <p>{ext.short_description}</p>
                                <span title="contributors" class="contributors"><FaSolidUsers /> {ext.contributors.length}</span>
                            <a class="btn" title="github" target="_blank" href={ext.repo}>
                                <FaBrandsGithub />
                            </a>
                            <a class="btn" title="download" target="_blank" href={ext.archive}>
                                <FaSolidDownload />
                            </a>
                        </div>
                    </div>
                )}
            </For>
        </div>
    );
};

const App = (props) => (
    <>
        <header>
            <A href="/">
                <img class="logo" src="./logo.svg" alt="LNbits Logo" />
            </A>
            <h2>Extension Repository</h2>
        </header>
        {props.children}
        <footer>
            LNbits, free and open-source Lightning wallet and accounts system.
            <a
                target="_blank"
                href="https://github.com/lnbits/lnbits-extensions">
                github
            </a>
        </footer>
    </>
);

render(
    () => (
        <Router root={App}>
            <Route path="/:name" component={Details} />
            <Route path="/" component={Home} />
        </Router>
    ),
    document.getElementById("root"),
);
