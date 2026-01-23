SELECT
  a.actor_id,
  a.first_name,
  a.last_name,
  GROUP_CONCAT(
    DISTINCT (
      ((c.name) :: text || ': ' :: text) || (
        SELECT
          GROUP_CONCAT((f.title) :: text) AS GROUP_CONCAT
        FROM
          (
            (
              film f
              JOIN film_category fc_1 ON ((f.film_id = fc_1.film_id))
            )
            JOIN film_actor fa_1 ON ((f.film_id = fa_1.film_id))
          )
        WHERE
          (
            (fc_1.category_id = c.category_id)
            AND (fa_1.actor_id = a.actor_id)
          )
        GROUP BY
          fa_1.actor_id
      )
    )
  ) AS film_info
FROM
  (
    (
      (
        actor a
        LEFT JOIN film_actor fa ON ((a.actor_id = fa.actor_id))
      )
      LEFT JOIN film_category fc ON ((fa.film_id = fc.film_id))
    )
    LEFT JOIN category c ON ((fc.category_id = c.category_id))
  )
GROUP BY
  a.actor_id,
  a.first_name,
  a.last_name;