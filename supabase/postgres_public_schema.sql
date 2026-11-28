-- ================================================
-- QoreDB Schema Export
-- Database: postgres
-- Schema: public
-- Driver: supabase
-- Date: 2026-11-28T00:49:42Z
-- ================================================

-- ================================================
-- TABLES
-- ================================================

-- Table: "public"."Docentes"
CREATE TABLE "public"."Docentes" (
  "id_docente" bigint NOT NULL,
  "id_usuario" bigint NOT NULL,
  "cedula" character varying,
  "nombres" character varying,
  "apellidos" character varying,
  "telefono" character varying,
  "correo" character varying,
  "direccion" character varying,
  "estado" smallint,
  PRIMARY KEY ("id_docente"),
  CONSTRAINT "Docentes_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."Usuarios" ("id_usuario")
);

-- Table: "public"."Estudiante_representante"
CREATE TABLE "public"."Estudiante_representante" (
  "id_representante_estudiante" bigint NOT NULL,
  "id_estudiante" bigint NOT NULL,
  "id_representante" bigint,
  "parentesco" character varying,
  "es_principal" smallint,
  PRIMARY KEY ("id_representante_estudiante"),
  CONSTRAINT "Estudiante_representante_id_estudiante_fkey" FOREIGN KEY ("id_estudiante") REFERENCES "public"."Estudiantes" ("id_estudiante"),
  CONSTRAINT "Estudiante_representante_id_representante_fkey" FOREIGN KEY ("id_representante") REFERENCES "public"."Representantes" ("id_representante")
);

-- Table: "public"."Estudiantes"
CREATE TABLE "public"."Estudiantes" (
  "id_estudiante" bigint NOT NULL,
  "cedula_escolar" character varying NOT NULL,
  "nombres" character varying,
  "apellidos" character varying,
  "fecha_nacimiento" time without time zone,
  "sexo" character varying,
  "direccion" text,
  "estado" smallint,
  PRIMARY KEY ("id_estudiante")
);

-- Table: "public"."Representantes"
CREATE TABLE "public"."Representantes" (
  "id_representante" bigint NOT NULL,
  "id_usuario" bigint NOT NULL,
  "cedula" character varying,
  "Nombres" character varying,
  "Apellidos" character varying,
  "telefono" character varying,
  "correo" character varying,
  "direccion" text,
  PRIMARY KEY ("id_representante"),
  CONSTRAINT "Representantes_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."Usuarios" ("id_usuario")
);

-- Table: "public"."Roles"
CREATE TABLE "public"."Roles" (
  "Id_Rol" bigint NOT NULL,
  "Nombre_rol" character varying NOT NULL,
  "Descripcion" text,
  PRIMARY KEY ("Id_Rol")
);

-- Table: "public"."Usuarios"
CREATE TABLE "public"."Usuarios" (
  "id_usuario" bigint NOT NULL,
  "nombre_usuario" character varying,
  "correo" character varying,
  "contraseña" character varying,
  "id_rol" bigint,
  "estado" smallint,
  "fecha_creacion" date,
  PRIMARY KEY ("id_usuario"),
  CONSTRAINT "Usuarios_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "public"."Roles" ("Id_Rol")
);

