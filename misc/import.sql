select
  '{ UserName: '''             + cast(username as nvarchar(max))             + '''',
  ', Score:    '               + cast(score as nvarchar(max))                + '',
  ', DatePlayed: ISODate('''   + convert(nvarchar(max), DatePlayed, 126)     + 'Z'')', 
  ', Seed:     '''             + cast(isnull(seed, 'null') as nvarchar(max)) + '''},' 
from games
