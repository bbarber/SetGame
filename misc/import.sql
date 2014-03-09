select
  '{ UserName: '''             + cast(username as nvarchar(max))             + '''',
  ', Score:    '''             + cast(score as nvarchar(max))                + '''',
  ', DatePlayed: new Date('''  + convert(nvarchar(max), DatePlayed, 126)     + ''').toISOString()', 
  ', Seed:     '''             + cast(isnull(seed, 'null') as nvarchar(max)) + '''},' 
from games
