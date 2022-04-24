--
-- PostgreSQL database dump
--

-- Dumped from database version 13.5
-- Dumped by pg_dump version 13.5

-- Started on 2022-04-23 03:41:24 MST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 3223 (class 0 OID 0)
-- Dependencies: 3
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 630 (class 1247 OID 24588)
-- Name: gamestat; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.gamestat AS ENUM (
    'open',
    'draw',
    'p1wins',
    'p2wins'
);


ALTER TYPE public.gamestat OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 203 (class 1259 OID 24609)
-- Name: board; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.board (
    board_id integer NOT NULL,
    board_status public.gamestat NOT NULL
);


ALTER TABLE public.board OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 24607)
-- Name: board_board_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.board_board_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.board_board_id_seq OWNER TO postgres;

--
-- TOC entry 3224 (class 0 OID 0)
-- Dependencies: 202
-- Name: board_board_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.board_board_id_seq OWNED BY public.board.board_id;


--
-- TOC entry 205 (class 1259 OID 24617)
-- Name: piece; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.piece (
    piece_id integer NOT NULL,
    piece_name character varying(16) NOT NULL
);


ALTER TABLE public.piece OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 24615)
-- Name: piece_piece_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.piece_piece_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.piece_piece_id_seq OWNER TO postgres;

--
-- TOC entry 3225 (class 0 OID 0)
-- Dependencies: 204
-- Name: piece_piece_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.piece_piece_id_seq OWNED BY public.piece.piece_id;


--
-- TOC entry 201 (class 1259 OID 24599)
-- Name: player; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.player (
    player_id integer NOT NULL,
    player_name character varying(32) NOT NULL
);


ALTER TABLE public.player OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 24644)
-- Name: player_piece; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.player_piece (
    board_id integer NOT NULL,
    player_id integer NOT NULL,
    piece_id integer NOT NULL,
    is_alive smallint NOT NULL,
    piece_position character varying(2) NOT NULL,
    positions_available character varying(128),
    CONSTRAINT player_piece_is_alive_check CHECK ((is_alive = ANY (ARRAY[0, 1])))
);


ALTER TABLE public.player_piece OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 24597)
-- Name: player_player_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.player_player_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.player_player_id_seq OWNER TO postgres;

--
-- TOC entry 3226 (class 0 OID 0)
-- Dependencies: 200
-- Name: player_player_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.player_player_id_seq OWNED BY public.player.player_id;


--
-- TOC entry 206 (class 1259 OID 24625)
-- Name: plays_in; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plays_in (
    board_id integer NOT NULL,
    player_id integer NOT NULL,
    is_first smallint NOT NULL,
    is_turn smallint NOT NULL,
    CONSTRAINT plays_in_is_first_check CHECK ((is_first = ANY (ARRAY[0, 1]))),
    CONSTRAINT plays_in_is_turn_check CHECK ((is_turn = ANY (ARRAY[0, 1])))
);


ALTER TABLE public.plays_in OWNER TO postgres;

--
-- TOC entry 3054 (class 2604 OID 24612)
-- Name: board board_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.board ALTER COLUMN board_id SET DEFAULT nextval('public.board_board_id_seq'::regclass);


--
-- TOC entry 3055 (class 2604 OID 24620)
-- Name: piece piece_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.piece ALTER COLUMN piece_id SET DEFAULT nextval('public.piece_piece_id_seq'::regclass);


--
-- TOC entry 3053 (class 2604 OID 24602)
-- Name: player player_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player ALTER COLUMN player_id SET DEFAULT nextval('public.player_player_id_seq'::regclass);


--
-- TOC entry 3213 (class 0 OID 24609)
-- Dependencies: 203
-- Data for Name: board; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.board (board_id, board_status) FROM stdin;
1	open
\.


--
-- TOC entry 3215 (class 0 OID 24617)
-- Dependencies: 205
-- Data for Name: piece; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.piece (piece_id, piece_name) FROM stdin;
1	King
2	Queen
3	Rook1
4	Rook2
5	Bishop1
6	Bishop2
7	Knight1
8	Knight2
9	Pawn1
10	Pawn2
11	Pawn3
12	Pawn4
13	Pawn5
14	Pawn6
15	Pawn7
16	Pawn8
\.


--
-- TOC entry 3211 (class 0 OID 24599)
-- Dependencies: 201
-- Data for Name: player; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.player (player_id, player_name) FROM stdin;
1	COMPUTER
2	new_player
\.


--
-- TOC entry 3217 (class 0 OID 24644)
-- Dependencies: 207
-- Data for Name: player_piece; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.player_piece (board_id, player_id, piece_id, is_alive, piece_position, positions_available) FROM stdin;
1	1	1	1	a1	
1	1	2	1	b1	
1	1	3	1	c1	
1	1	4	1	d1	
1	1	5	1	e1	
1	1	6	1	f1	
1	1	7	1	g1	
1	1	8	1	h1	
1	1	9	1	a2	
1	1	10	1	b2	
1	1	11	1	c2	
1	1	12	1	d2	
1	1	13	1	e2	
1	1	14	1	f2	
1	1	15	1	g2	
1	1	16	1	h2	
1	2	1	1	a7	
1	2	2	1	b7	
1	2	3	1	c7	
1	2	4	1	d7	
1	2	5	1	e7	
1	2	6	1	f7	
1	2	7	1	g7	
1	2	8	1	h7	
1	2	9	1	a8	
1	2	10	1	b8	
1	2	11	1	c8	
1	2	12	1	d8	
1	2	13	1	e8	
1	2	14	1	f8	
1	2	15	1	g8	
1	2	16	1	h8	
\.


--
-- TOC entry 3216 (class 0 OID 24625)
-- Dependencies: 206
-- Data for Name: plays_in; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plays_in (board_id, player_id, is_first, is_turn) FROM stdin;
1	1	1	1
1	2	0	0
\.


--
-- TOC entry 3227 (class 0 OID 0)
-- Dependencies: 202
-- Name: board_board_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.board_board_id_seq', 1, false);


--
-- TOC entry 3228 (class 0 OID 0)
-- Dependencies: 204
-- Name: piece_piece_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.piece_piece_id_seq', 1, false);


--
-- TOC entry 3229 (class 0 OID 0)
-- Dependencies: 200
-- Name: player_player_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.player_player_id_seq', 1, false);


--
-- TOC entry 3064 (class 2606 OID 24614)
-- Name: board board_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.board
    ADD CONSTRAINT board_pkey PRIMARY KEY (board_id);


--
-- TOC entry 3066 (class 2606 OID 24624)
-- Name: piece piece_piece_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.piece
    ADD CONSTRAINT piece_piece_name_key UNIQUE (piece_name);


--
-- TOC entry 3068 (class 2606 OID 24622)
-- Name: piece piece_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.piece
    ADD CONSTRAINT piece_pkey PRIMARY KEY (piece_id);


--
-- TOC entry 3074 (class 2606 OID 24649)
-- Name: player_piece player_piece_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_piece
    ADD CONSTRAINT player_piece_pkey PRIMARY KEY (board_id, player_id, piece_id);


--
-- TOC entry 3060 (class 2606 OID 24604)
-- Name: player player_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_pkey PRIMARY KEY (player_id);


--
-- TOC entry 3062 (class 2606 OID 24606)
-- Name: player player_player_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_player_name_key UNIQUE (player_name);


--
-- TOC entry 3070 (class 2606 OID 24633)
-- Name: plays_in plays_in_board_id_player_id_is_first_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plays_in
    ADD CONSTRAINT plays_in_board_id_player_id_is_first_key UNIQUE (board_id, player_id, is_first);


--
-- TOC entry 3072 (class 2606 OID 24631)
-- Name: plays_in plays_in_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plays_in
    ADD CONSTRAINT plays_in_pkey PRIMARY KEY (board_id, player_id);


--
-- TOC entry 3077 (class 2606 OID 24650)
-- Name: player_piece player_piece_board_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_piece
    ADD CONSTRAINT player_piece_board_id_fkey FOREIGN KEY (board_id) REFERENCES public.board(board_id);


--
-- TOC entry 3079 (class 2606 OID 24660)
-- Name: player_piece player_piece_piece_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_piece
    ADD CONSTRAINT player_piece_piece_id_fkey FOREIGN KEY (piece_id) REFERENCES public.piece(piece_id);


--
-- TOC entry 3078 (class 2606 OID 24655)
-- Name: player_piece player_piece_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_piece
    ADD CONSTRAINT player_piece_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.player(player_id);


--
-- TOC entry 3075 (class 2606 OID 24634)
-- Name: plays_in plays_in_board_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plays_in
    ADD CONSTRAINT plays_in_board_id_fkey FOREIGN KEY (board_id) REFERENCES public.board(board_id);


--
-- TOC entry 3076 (class 2606 OID 24639)
-- Name: plays_in plays_in_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plays_in
    ADD CONSTRAINT plays_in_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.player(player_id);


-- Completed on 2022-04-23 03:41:24 MST

--
-- PostgreSQL database dump complete
--

