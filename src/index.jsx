import { createSignal, For, onMount } from "solid-js";
import { render } from "solid-js/web";
import "./index.scss";
import data from "../extensions.json";
import metadata from "../metadata.json";
import { Router, Route, useParams, A, useNavigate } from "@solidjs/router";
import { FaSolidUsers, FaBrandsGithub, FaSolidDownload } from "solid-icons/fa";
import { BiSolidBolt } from "solid-icons/bi";
import { Converter } from "showdown";
import {
    RiArrowsArrowLeftSLine,
    RiArrowsArrowRightSLine,
} from "solid-icons/ri";

const extensions = [
    ...new Map(data.extensions.map((ext) => [ext.id, ext])).values(),
];
extensions.forEach((ext) => {
    const meta = metadata.find((m) => m.id === ext.id);
    if (meta) {
        Object.assign(ext, meta);
    }
    if (!ext.contributors) ext.contributors = [];
});
console.log(extensions);

const Gallery = ({ images }) => {
    const [activeIndex, setActiveIndex] = createSignal(0);
    const [fullScreen, setFullScreen] = createSignal(false);
    const next = () => setActiveIndex((i) => (i + 1) % images.length);
    const prev = () =>
        setActiveIndex((i) => (i - 1 + images.length) % images.length);

    let touchstartX, touchendX;
    const touchStart = (e) => (touchstartX = e.changedTouches[0].screenX);
    const touchEnd = (e) => {
        touchendX = e.changedTouches[0].screenX;
        if (touchendX < touchstartX) prev();
        if (touchendX > touchstartX) next();
        // if (touchendX === touchstartX) clickAction();
    };
    let mouseStartX, mouseEndX;
    const mouseStart = (e) => (mouseStartX = e.screenX);
    const mouseEnd = (e) => {
        mouseEndX = e.screenX;
        if (mouseEndX < mouseStartX) prev();
        if (mouseEndX > mouseStartX) next();
        // if (mouseEndX === mouseStartX) clickAction();
    };

    return (
        <div id="gallery" class={fullScreen() === true ? "fullscreen" : ""}>
            <span class="gallery-arrow" onClick={prev}>
                <RiArrowsArrowLeftSLine />
            </span>
            <div class="gallery-images">
                <For each={images}>
                    {(img, i) => (
                        <div
                            class={
                                activeIndex() === i()
                                    ? "gallery-item-active"
                                    : "gallery-item"
                            }>
                            <Show
                                when={
                                    img.link &&
                                    img.link.search("youtube") !== -1
                                }
                                fallback={<img src={img.uri} />}>
                                <div class="embed-youtube">
                                    <iframe
                                        src={img.link}
                                        border="0"
                                        style="outline:none"
                                    />
                                </div>
                            </Show>
                        </div>
                    )}
                </For>
                <div
                    onMouseDown={mouseStart}
                    onMouseUp={mouseEnd}
                    onTouchStart={touchStart}
                    onTouchEnd={touchEnd}
                    class="overlay"></div>
            </div>
            <span class="gallery-arrow" onClick={prev}>
                <RiArrowsArrowRightSLine />
            </span>
        </div>
    );
};

const Details = () => {
    let descriptionRef, termsRef;
    const params = useParams();
    const [activeTab, setActiveTab] = createSignal("description");
    const extensions = [
        ...new Map(data.extensions.map((ext) => [ext.id, ext])).values(),
    ];
    const ext_versions = data.extensions
        .filter((ext) => ext.id === params.name)
        .reverse();
    const ext = extensions.find((ext) => ext.id === params.name);
    const fetch_and_render_markup = (url, ref) => {
        fetch(url)
            .then((res) => res.text())
            .then((data) => {
                const converter = new Converter();
                const html = converter.makeHtml(data);
                ref.innerHTML = html;
            });
    };

    onMount(() => {
        fetch_and_render_markup(ext.description_md, descriptionRef);
        fetch_and_render_markup(ext.terms_and_conditions_md, termsRef);
    });

    return (
        <div>
            <div class="ext-header">
                <div class="ext-image">
                    <img src={ext.icon} alt={ext.id} />
                </div>
                <div class="ext-headline">
                    <h1>{ext.name}</h1>
                    <p>{ext.short_description}</p>
                    <p>
                        Latest version: {ext.version}
                        <br />
                        License: {ext.license}
                        <br />
                        Minimum LNbits version:{" "}
                        {ext.min_lnbits_version || "0.0.0"}
                        <br />
                        Hash: {ext.hash}
                        <br />
                    </p>
                    <a href={ext.archive} target="_blank" class="btn">
                        <FaSolidDownload />
                        &nbsp;Download
                    </a>
                    <a href={ext.repo} target="_blank" class="btn">
                        <FaBrandsGithub />
                        &nbsp;Github
                    </a>
                </div>
                <div id="contributors">
                    <h4>
                        <FaSolidUsers /> Contributors
                    </h4>
                    {ext.contributors.map((contributor) => (
                        <>
                            <a href={contributor.uri || "#"} target="_blank">
                                {contributor.name}{" "}
                                <small>{contributor.role}</small>
                            </a>
                            <br />
                        </>
                    ))}
                </div>
            </div>
            <div id="tabs">
                <span
                    class={activeTab() === "description" ? "active" : ""}
                    onClick={() => setActiveTab("description")}>
                    Description
                </span>
                <span
                    class={activeTab() === "gallery" ? "active" : ""}
                    onClick={() => setActiveTab("gallery")}>
                    Gallery
                </span>
                <span
                    class={activeTab() === "terms" ? "active" : ""}
                    onClick={() => setActiveTab("terms")}>
                    Terms and Conditions
                </span>
                <span
                    class={activeTab() === "versions" ? "active" : ""}
                    onClick={() => setActiveTab("versions")}>
                    Versions
                </span>
            </div>
            <div
                ref={descriptionRef}
                class={
                    activeTab() === "description" ? "active-tab" : "tab"
                }></div>
            <div class={activeTab() === "gallery" ? "active-tab" : "tab"}>
                <Gallery images={ext.images} />
            </div>
            <div
                ref={termsRef}
                class={activeTab() === "terms" ? "active-tab" : "tab"}></div>
            <div class={activeTab() === "versions" ? "active-tab" : "tab"}>
                {ext_versions.map((ext) => (
                    <div>
                        <h3>
                            {ext.version}
                            <a href={ext.archive} target="_blank" class="btn">
                                <FaSolidDownload /> Download
                            </a>
                            <a
                                href={`${ext.repo}/releases/v${ext.version}`}
                                target="_blank"
                                class="btn">
                                Release Notes
                            </a>
                        </h3>
                        <p>
                            Minimum LNbits version:{" "}
                            {ext.min_lnbits_version || "0.0.0"}
                            <br />
                            <Show when={ext.max_lnbits_version && ext.max_lnbits_version != "0"}>
                                Maximum LNbits version:{" "}
                                {ext.max_lnbits_version}
                            </Show>
                            <br />
                            Hash: {ext.hash}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Home = () => {
    const navigate = useNavigate();
    return (
        <div id="extension-list">
            <For each={extensions}>
                {(ext) => (
                    <div
                        class="extension"
                        onClick={() => navigate(`/${ext.id}`)}>
                        <div class="ext-image">
                            <A href={ext.id}>
                                <img src={ext.icon} alt={ext.id} />
                            </A>
                        </div>
                        <div class="ext-desc">
                            <h2>
                                <A href={ext.id}>{ext.name}</A>
                                <span class="min-version" title="Minimum LNbits version">
                                    {ext.min_lnbits_version || "0.0.0"}
                                </span>
                                <span class="version" title="Extension version">{ext.version}</span>
                            </h2>
                            <p>{ext.short_description}</p>
                            <span title="contributors" class="contributors">
                                <FaSolidUsers /> {ext.contributors.length}
                            </span>
                            <a
                                class="btn"
                                title="github"
                                target="_blank"
                                href={ext.repo}
                                onClick={(e) => e.stopPropagation()}>
                                <FaBrandsGithub />
                            </a>
                            <a
                                class="btn"
                                title="download"
                                target="_blank"
                                href={ext.archive}
                                onClick={(e) => e.stopPropagation()}>
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
                class="btn"
                target="_blank"
                href="https://github.com/lnbits/lnbits-extensions">
                <FaBrandsGithub /> Github
            </a>
            <a class="btn" target="_blank" href="https://lnbits.com/">
                <BiSolidBolt /> LNbits.com
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
