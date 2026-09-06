with sequences as (select *
                   from (select table_schema,
                                table_name,
                                column_name,
                                pg_get_serial_sequence(format('%I.%I', table_schema, table_name),
                                                       column_name) as col_sequence
                         from information_schema.columns
                         where table_schema not in ('pg_catalog', 'information_schema')) t
                   where col_sequence is not null),
     maxvals as (select table_schema,
                        table_name,
                        column_name,
                        col_sequence,
                        (xpath('/row/max/text()',
                               query_to_xml(format('select max(%I) from %I.%I', column_name, table_schema, table_name),
                                            true, true, ''))
                            )[1]::text::bigint as max_val
                 from sequences)
select table_schema
     , table_name
     , column_name
     , col_sequence
     , coalesce(max_val, 0) as max_val
     , setval(col_sequence, coalesce(max_val, 1))
from maxvals;
